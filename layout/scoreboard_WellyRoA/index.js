LoadEverything().then(() => {
  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(".mask", { width: 0, duration: 1, ease: "power2.inOut" }, 0)
    .from(
      ".doubles .info",
      { opacity: 0, duration: 0.5, ease: "power2.inOut" },
      0.8
    );

  Start = async () => {
    startingAnimation.restart();
    // setInterval(getState, 2000);
  };
  





  Update = async (event) => {

    let data = event.data;
    let oldData = event.oldData;

    for (const [t, team] of [
      data.score[window.scoreboardNumber].team["1"],
      data.score[window.scoreboardNumber].team["2"],
    ].entries()) {
      for (const [p, player] of [team.player["1"]].entries()) {
        if (player) {
          if (Object.keys(team.player).length == 1) {
            SetInnerHtml(
              $(`.t${t + 1}.container .name`),
              `
            <span>
              <span class="sponsor">
                ${player.team ? player.team.toUpperCase() : ""}
              </span>
              ${player.name ? await Transcript(player.name.toUpperCase()) : ""}
              ${team.losers ? "(L)" : ""}
            </span>
            `
            );
          } else {
            let teamName = "";

            if (!team.teamName || team.teamName == "") {
              let names = [];
              for (const [p, player] of Object.values(team.player).entries()) {
                if (player && player.name) {
                  names.push(await Transcript(player.name));
                }
              }
              teamName = names.join(" / ");
            } else {
              teamName = team.teamName;
            }

            SetInnerHtml(
              $(`.t${t + 1}.container .name`),
              `
              <span>
                ${teamName.toUpperCase()}
                ${team.losers ? "(L)" : ""}
              </span>
              `
            );
          }

          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .pronoun`),
            Object.keys(team.player).length == 1 ? player.pronoun : ""
          );

          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .flagcountry`),
            player.country.asset && Object.keys(team.player).length == 1
              ? `
                <div class='flag' style="background-image: url('../../${player.country.asset.toLowerCase()}')"></div>
              `
              : ""
          );

          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .flagstate`),
            player.state.asset && Object.keys(team.player).length == 1
              ? `
                <div class='flag' style="background-image: url('../../${player.state.asset}')"></div>
              `
              : ""
          );


          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .twitter`),
            player.twitter && Object.keys(team.player).length == 1
              ? `<span class="twitter_logo"></span>${String(player.twitter)}`
              : ""
          );

          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .seed`),
            player.seed ? `Seed ${String(player.seed)}` : ""
          );

          SetInnerHtml($(`.t${t + 1}.p${p + 1} .score`), String(team.score));
            
          let teamMultiplier = t == 0 ? 1 : -1;

          await CharacterDisplay(
            $(`.p${t + 1}.character`),
            {
              source: `score.${window.scoreboardNumber}.team.${t + 1}`,
              anim_out: {
                autoAlpha: 0,
                x: -20 * teamMultiplier + "px",
                stagger: teamMultiplier * 0.2,
                duration: 0.4,
              },
              anim_in: {
                autoAlpha: 1,
                x: "0px",
                stagger: teamMultiplier * 0.2,
                duration: 0.4,
              },
            },
            event
          );




          SetInnerHtml($(`.t${t + 1} .doubles_score`), String(team.score));

          SetInnerHtml(
            $(`.t${t + 1}.p${p + 1} .sponsor-container`),
            player.sponsor_logo && Object.keys(team.player).length == 1
              ? `<div class='sponsor-logo' style="background-image: url('../../${player.sponsor_logo}')"></div>`
              : ""
          );

        }
        if(team.color) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    }

    let phaseTexts = [];
    if (data.tournamentInfo.eventName)
      phaseTexts.push(data.tournamentInfo.eventName);
    if (data.score[window.scoreboardNumber].phase) phaseTexts.push(data.score[window.scoreboardNumber].phase);

    SetInnerHtml($(".info.material_container .phase"), phaseTexts.join(" - "));
    SetInnerHtml(
      $(".info.material_container .tournament_name"),
      data.tournamentInfo.tournamentName
    );

    SetInnerHtml($(".singles .match"), data.score[window.scoreboardNumber].match);
    SetInnerHtml($(".singles .best_of"), data.score[window.scoreboardNumber].best_of_text);

    if (
      Object.keys(oldData).length == 0 ||
      Object.keys(oldData.commentary).length 
    ) {
      let html = "";
      Object.values(data.commentary).forEach((commentator, index) => {
        html += `
              <div class="commentator_container commentator${index}">
                  <div class="name"></div>
                  <div class="pronoun"></div>
              </div>
          `;
      });
      console.log({html});
      $(".com_container").html(html);
    }

    for (const [index, commentator] of Object.values(
      data.commentary
    ).entries()) {
      if (commentator.name) {
        $(`.commentator${index}`).css("display", "");
        SetInnerHtml(
          $(`.commentator${index} .name`),
          `
            <span class="mic_icon"></span>
            <span class="team">
              ${commentator.team ? commentator.team + "&nbsp;" : ""}
            </span>
            ${await Transcript(commentator.name)}
          `
        );
        SetInnerHtml($(`.commentator${index} .pronoun`), commentator.pronoun);
        SetInnerHtml(
          $(`.commentator${index} .real_name`),
          commentator.real_name
        );
        SetInnerHtml(
          $(`.commentator${index} .twitter`),
          commentator.twitter ? "@" + commentator.twitter : ""
        );
      } else {
        $(`.commentator${index}`).css("display", "none");
      }
    }
  };
});


