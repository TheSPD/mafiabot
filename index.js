const sulla = require("sulla");
const mafiaApp = require("./src/app");
// const redis = require("redis");

// redis_client = redis.createClient({
//   port: 6379,
//   host: "127.0.0.1",
// });

sulla.create().then((client) => start(client));

function getMentionFromId(id) {
  return `${id.split("@")[0]}`;
}

function start(client) {
  client.onMessage((message) => {
    console.log(message);
    groupId = message.from;
    isLinkedGroup = mafiaApp.game.isLinkedGroup(groupId);
    senderId = message.sender.id;
    isMafiaGroup = mafiaApp.game.isMafiaGroup(groupId);

    if (message.body === "link") {
      groupId = message.from;
      mafiaApp.game.linkGroup(groupId);
      client.sendText(groupId, "Group successfully linked!!!");
      return;
    }

    if (message.body === "info") {
      client.sendText(groupId, "*Mafia* - A social deduction game");
      return;
    }

    if (message.body === "reset" && isLinkedGroup) {
      mafiaApp.game.reset();
      client.sendText("Reset the game");
    }

    if (message.body.startsWith("add") && isLinkedGroup) {
      try {
        if (message.mentionedJidList.length > 1) {
          client.sendText("Add only one player at a time");
          return;
        }

        if (message.mentionedJidList.length === 1) {
          playerId = message.mentionedJidList[0];
          mafiaApp.player.add(playerId);
        } else {
          mafiaApp.player.add(senderId);
        }

        listOfPlayers = mafiaApp.player.getAllPlayers();

        client.sendMentioned(
          groupId,
          `Players in the room: ${listOfPlayers
            .map((playerId) => `@${getMentionFromId(playerId)}`)
            .join(", ")}`,
          listOfPlayers.map((playerId) => getMentionFromId(playerId))
        );
      } catch (err) {
        client.sendText(groupId, err);
      }
      return;
    }

    if (message.body === "start" && isLinkedGroup) {
      try {
        mafiaApp.game.start();

        let mafiaGroupId;
        client
          .sendText(groupId, "Village sleeps....")
          .then((resp) => mafiaApp.game.sleep(1000))
          .then(() => mafiaApp.game.assignMafias())
          // .then(() => [senderId])
          .then((mafiaPlayers) => client.createGroup("Mafiosos", mafiaPlayers))
          .then(
            (groupResponse) => (mafiaGroupId = groupResponse.gid._serialized)
          )
          .then(() => client.sendText(groupId, "Mafia awakens...."))
          .then(() => mafiaApp.game.linkMafiaGroup(mafiaGroupId))
          .then(() => client.sendText(mafiaGroupId, "You're all mafias!!!"))
          .then((resp) => mafiaApp.game.sleep(1000))
          .then(() => {
            alivePlayers = mafiaApp.player.getAlivePlayers();
            client.sendMentioned(
              mafiaApp.game.getMafiaGroup(),
              `Murder one of the players : 
              ${alivePlayers
                .map(
                  (playerId, index) => `${index} @${getMentionFromId(playerId)}`
                )
                .join("\n")}
                
                Type murder <number> to murder the player from the numbered list

                Remember that this is **not voting**. Decide among yourself and then choose one player to murder. Anyone can type the command to murder`,
              alivePlayers.map((playerId) => getMentionFromId(playerId))
            );
          });
      } catch (err) {
        client.sendText(groupId, err);
      }
      return;
    }

    if (message.body.startsWith("vote") && isLinkedGroup) {
      if (message.mentionedJidList.length !== 1) {
        client.sendText(message.from, `Please vote for one player`);
        return;
      }

      toId = message.mentionedJidList[0];
      fromId = message.sender.id;

      try {
        mafiaApp.voting
          .vote(fromId, toId)
          .then(() => mafiaApp.voting.remainingVoters())
          .then((remainingVoters) => {
            console.log("Booga boogas");
            if (remainingVoters.length === 0) {
              return true;
            } else {
              client.sendMentioned(
                groupId,
                `Remaining Voters: ${remainingVoters.map(
                  (playerId) => `@${getMentionedId(playerId)}`
                )}`,
                remainingVoters
              );
              return false;
            }
          })
          .then((completedVoting) => {
            if (!completedVoting) {
              return;
            } else {
              mafiaApp.voting.getVoteCounts().then((voteCounts) => {
                total = Object.values(voteCounts).reduce((a, b) => a + b);
                majorityMarker = Math.floor(total / 2);
                majority = Object.keys(voteCounts).filter(
                  (id) => voteCounts[id] > majorityMarker
                );

                if (majority.length !== 1) {
                  mafiaApp.voting
                    .reset()
                    .then(() =>
                      client.sendText("No consensus reached. Vote again")
                    );
                  return;
                }
                client
                  .sendText(groupId, "Village sleeps....")
                  .then(() => mafiaApp.player.getAliveMafiaPlayers())
                  .then((aliveMafiaPlayers) =>
                    Promise.all(
                      aliveMafiaPlayers.map((playerId) => {
                        client.addParticipant(mafiaGroupId, playerId);
                      })
                    )
                  )
                  .then(() => client.sendText(groupId, "Mafia awakens...."))
                  .then(() => mafiaApp.game.sleep(1000))
                  .then(() => {
                    alivePlayers = mafiaApp.player.getAlivePlayers();
                    client.sendMentioned(
                      mafiaApp.game.getMafiaGroup(),
                      `Murder one of the players : 
                    ${alivePlayers
                      .map(
                        (playerId, index) =>
                          `${index} @${getMentionFromId(playerId)}`
                      )
                      .join("\n")}
                      
                      Type murder <number> to murder the player from the numbered list
      
                      Remember that this is **not voting**. Decide among yourself and then choose one player to murder. Anyone can type the command to murder`,
                      alivePlayers.map((playerId) => getMentionFromId(playerId))
                    );
                  });
              });
            }
          });
      } catch (err) {
        client.sendText(groupId, err);
      }
    }

    if (message.body.startsWith("murder") && isMafiaGroup) {
      parameters = message.body.split(" ").slice(1);

      if (parameters.length !== 1) {
        client.sendText(message.from, "Please kill exactly one player");
        return;
      }

      if (
        isNaN(parameters[0]) ||
        Number(parameters[0]) !== parseInt(Number(parameters[0]), 10)
      ) {
        client.sendText(message.from, "Please select an integer");
        return;
      }

      murderIndex = parseInt(parameters[0], 10);
      mafiaGroupId = mafiaApp.game.getMafiaGroup();
      groupId = mafiaApp.game.getGroup();
      alivePlayers = mafiaApp.player.getAlivePlayers();
      murderedId = alivePlayers[murderIndex];

      if (murderedId === undefined) {
        client.sendText(
          message.from,
          "Please select an integer from the given numbers"
        );
        return;
      }

      try {
        client
          .sendText(groupId, "Mafia chose someone to murder....")
          .then(() => mafiaApp.game.murder(murderedId))
          .then(() => client.getGroupMembersIds(mafiaGroupId))
          .then((allParticipants) => {
            allParticipantIds = allParticipants.map(
              (participant) => participant._serialized
            );
            client.getGroupAdmins(mafiaGroupId).then((admins) => {
              adminIds = admins.map((admin) => admin._serialized);
              mafiaPlayerIds = allParticipantIds.filter(
                (participantId) => !adminIds.includes(participantId)
              );

              mafiaPlayerIds.map((playerId) =>
                client.removeParticipant(mafiaGroupId, playerId)
              );
            });
          })
          .then(() => mafiaApp.game.setDay())
          .then(client.sendText(groupId, "Village awakens..."))
          .then(() => mafiaApp.game.sleep(1000))
          .then(() =>
            client.sendMentioned(
              groupId,
              `to find @${getMentionFromId(murderedId)} dead`,
              [getMentionFromId(murderedId)]
            )
          )
          .then(() => mafiaApp.game.status())
          .then(({ villagersWon, mafiaWon }) => {
            if (villagersWon) {
              client.sendText(groupId, "Villagers won!!!");
            } else if (mafiaWon) {
              client.sendText(groupId, "Mafia won!!!");
            } else {
              client.sendText(groupId, "Vote using vote <@mention>");
            }
          });
      } catch (err) {
        client.sendText(mafiaGroupId, err);
      }
      return;
    }
  });
}
