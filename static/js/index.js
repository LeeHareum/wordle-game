// const 정답 = "APPLE";

let attempts = 0; //시도
let index = 0; //다음인덱스로 넘어가게 하기위한 let
let timer = 0;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = " GAME OVER 👏🏻";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:30vw; background-color:rgb(234, 239, 227);opacity: 0.65; width:270px; height:100px;font-size:35px;font-weight:bold; padding: 5px 50px 5px 50px;border-radius: 60px; border-width:5px;border-style:solid;border-color:rgb(79, 93, 59);";
    document.body.appendChild(div); //html의 body에 이div를넣겠다
  };
  const nextLine = () => {
    if (attempts === 6) return GAMEOVER();
    attempts++;
    index = 0;
  };
  const GAMEOVER = () => {
    window.removeEventListener("keydown", handlekeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterkey = async () => {
    let 맞은_갯수 = 0;
    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer"); //await은 상단에 async넣어줘야함,서버의응답을기다리는함수/fetch()는 서버에요청보내는함수
    const 정답_객체 = await 응답.json(); //JavaScript Object Notation=js에맞는포맷으로바꿔주는json
    const 정답 = 정답_객체.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_알파벳 = block.innerText;
      const 정답_알파벳 = 정답[i];

      if (입력한_알파벳 === 정답_알파벳) {
        맞은_갯수++;
        block.style.animation = "blockMotion 1s ease forwards ";
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_알파벳))
        block.style.background = "#C9B458";
      else block.style.background = "#787C7E";
      block.style.color = "white";
    }
    if (맞은_갯수 === 5) GAMEOVER();
    else nextLine();
  };
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handlekeydown = (event) => {
    const key = event.key.toUpperCase(); //toUpperCase 대문자로변환
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    //console.log(event.keyCode, event.key); 콘솔창에서 키 코드와번호 찾을때
    if (event.key === "Backspace") handleBackspace(thisBlock);
    else if (index === 5) {
      if (event.key === "ENTER") handleEnterkey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      //아래index++;랑 같은 결과_ index += 1; , index = index + 1;
      index++;
    }
  };

  // ▼ 키보트클릭으로 인덱스입력!!!
  const 키클릭 = () => {
    const 키 = document.querySelectorAll(
      ".keybord-top_Q,.keybord-top_W,.keybord-top_E,.keybord-top_R,.keybord-top_T,.keybord-top_Y,.keybord-top_U,.keybord-top_I,.keybord-top_O,.keybord-top_P,.keybord-middle_A,.keybord-middle_S,.keybord-middle_D,.keybord-middle_F,.keybord-middle_G,.keybord-middle_H,.keybord-middle_J,.keybord-middle_K,.keybord-middle_L,.keybord-bottom_ENTER,.keybord-bottom_Z,.keybord-bottom_X,.keybord-bottom_C,.keybord-bottom_V,.keybord-bottom_B,.keybord-bottom_N,.keybord-bottom_M,.keybord-bottom_⌫"
    );

    키.forEach((button) => {
      button.addEventListener("click", function () {
        const letter = this.getAttribute("data-key"); // 해당 버튼의 데이터 속성 값 가져오기

        const boardblock = document.querySelectorAll(
          `.board-block[data-index='${attempts}${index}']`
        );

        //backspace인 경우

        if (letter === "⌫") {
          handleBackspace();
          return;
        }
        if (letter === "ENTER") {
          handleEnterkey();
          return;
        }

        // 입력 가능한 위치에 글자 추가
        for (let i = 0; i < boardblock.length; i++) {
          if (boardblock[i].innerText === "") {
            boardblock[i].innerText = letter;
            index += 1; // 인덱스 증가
            return;
          }
        }
      });
    });
  };

  const Timer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timerDiv = document.querySelector("#time");
      timerDiv.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };
  Timer();
  window.addEventListener("keydown", handlekeydown);
  window.addEventListener("load", 키클릭);
}

appStart();
