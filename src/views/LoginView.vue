<template>
  <div class="screen-1">
    <svg
      class="logo"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="300"
      height="300"
      viewbox="0 0 640 480"
      xml:space="preserve"
    >
      <g transform="matrix(3.31 0 0 3.31 320.4 240.4)">
        <circle
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(61, 71, 133);
            fill-rule: nonzero;
            opacity: 1;
          "
          cx="0"
          cy="0"
          r="40"
        ></circle>
      </g>
      <g transform="matrix(0.98 0 0 0.98 268.7 213.7)">
        <circle
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(255, 255, 255);
            fill-rule: nonzero;
            opacity: 1;
          "
          cx="0"
          cy="0"
          r="40"
        ></circle>
      </g>
      <g transform="matrix(1.01 0 0 1.01 362.9 210.9)">
        <circle
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(255, 255, 255);
            fill-rule: nonzero;
            opacity: 1;
          "
          cx="0"
          cy="0"
          r="40"
        ></circle>
      </g>
      <g transform="matrix(0.92 0 0 0.92 318.5 286.5)">
        <circle
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(255, 255, 255);
            fill-rule: nonzero;
            opacity: 1;
          "
          cx="0"
          cy="0"
          r="40"
        ></circle>
      </g>
      <g transform="matrix(0.16 -0.12 0.49 0.66 290.57 243.57)">
        <polygon
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(255, 255, 255);
            fill-rule: nonzero;
            opacity: 1;
          "
          points="-50,-50 -50,50 50,50 50,-50 "
        ></polygon>
      </g>
      <g transform="matrix(0.16 0.1 -0.44 0.69 342.03 248.34)">
        <polygon
          style="
            stroke: rgb(0, 0, 0);
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-linecap: butt;
            stroke-dashoffset: 0;
            stroke-linejoin: miter;
            stroke-miterlimit: 4;
            fill: rgb(255, 255, 255);
            fill-rule: nonzero;
            opacity: 1;
          "
          vector-effect="non-scaling-stroke"
          points="-50,-50 -50,50 50,50 50,-50 "
        ></polygon>
      </g>
    </svg>
    <div class="email">
      <label for="email">邮箱</label>
      <div class="sec-2">
        <ion-icon name="mail-outline"></ion-icon>
        <input type="email" name="email" placeholder="输入邮箱" />
      </div>
    </div>
    <div class="password">
      <label for="password">密码</label>
      <div class="sec-2">
        <ion-icon name="lock-closed-outline"></ion-icon>
        <input class="pas" type="password" name="password" placeholder="输入密码" />
        <ion-icon class="show-hide" name="eye-outline"></ion-icon>
      </div>
    </div>
    <button class="login">登录</button>
    <div class="footer">
      <span>注册</span>
      <span>忘记密码?</span>
    </div>
  </div>
</template>

<script>
</script>
<style>
* {
  font-family: 'Poppins';
}
body {
  user-select: none;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #dde5f4;
  height: 100vh;
}
.screen-1 {
  background: #f1f7fe;
  padding: 2em;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0 0 2em #e6e9f9;
  gap: 2em;
}
.screen-1 .logo {
  margin-top: -3em;
}
.screen-1 .email {
  background: white;
  box-shadow: 0 0 2em #e6e9f9;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: #4d4d4d;
  margin-top: -3em;
}
.screen-1 .email input {
  outline: none;
  border: none;
}
.screen-1 .email input::placeholder {
  color: black;
  font-size: 0.9em;
}
.screen-1 .email ion-icon {
  color: #4d4d4d;
  margin-bottom: -0.2em;
}
.screen-1 .password {
  background: white;
  box-shadow: 0 0 2em #e6e9f9;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: #4d4d4d;
}
.screen-1 .password input {
  outline: none;
  border: none;
}
.screen-1 .password input::placeholder {
  color: black;
  font-size: 0.9em;
}
.screen-1 .password ion-icon {
  color: #4d4d4d;
  margin-bottom: -0.2em;
}
.screen-1 .password .show-hide {
  margin-right: -5em;
}
.screen-1 .login {
  padding: 1em;
  background: #3e4684;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
}
.screen-1 .footer {
  display: flex;
  justify-content: space-around;
  font-size: 0.7em;
  color: #5e5e5e;
  gap: 14em;
  padding-bottom: 10em;
}
.screen-1 .footer span {
  cursor: pointer;
}
button {
  cursor: pointer;
}
</style>
