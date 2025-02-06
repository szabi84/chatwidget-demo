(function () {

  // Inject the CSS
  const style = document.createElement('style')
  style.innerHTML = `
  .hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  .visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  #chat-widget-container {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    right: 0;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
  }
  #chat-bubble {
    position: fixed;
    bottom: 15px;
    transform: translateY(0);
    transition: transform 1s ease-in-out, opacity 1s ease-in-out;
    opacity: 1;
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px 8px 30px 30px;
    padding: 5px 10px;
    line-height: 2.25rem;
    cursor: pointer;
    border: none;
  }
  #chat-bubble:focus {
    outline: none;
  }
  .chat-bubble:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 .21429rem rgba(255,255,255,0.4);
  }
  .chat-icon{
    height: 1.8rem;
  }
  .chat-text {
    display: inline-block;
    font-size: 1.1rem;
    margin-left: 0.5rem;
    font-weight: 800;
  }  
  #chat-bubble.hidden {
    transform: translateY(100%);
    opacity: 0;
  }
  #chat-bubble.visible {
    transform: translateY(0);
    opacity: 1;
  }
  #chat-popup {
    height: 100vh;
    max-height: 100vh;
    transition: all 0.7s;
    overflow: hidden;
    display: flex;
    position: absolute;
    right: 0;
    bottom: 0;
    flex-direction: column;
    width: 24rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background-color: #ffffff;
    transform: translateX(100%);
    transition: transform 0.5s ease-in-out;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  #chat-popup.visible {
    transform: translateX(0);
  }
  #chat-header {
    display: block;
    padding: 0.5rem;
    text-align: right;
    color: #ffffff;
  }
  #close-popup {
    background-color: transparent;
    cursor: pointer;
    border: 2px solid transparent;
    padding: 2px 2px 0px 6px
  }
  #close-popup:focus {
    outline: none;
  }
  #close-popup:focus-visible {
    border: 2px solid #2B3E5370;
    border-radius: 6px;
  }
  .close-icon {
    width: 1.2rem;
  }
  #fullscreen-popup {
    background-color: transparent;
    cursor: pointer;
    border: 2px solid transparent;
    padding: 5px 5px 0px 5px;
  }
  #fullscreen-popup:focus {
    outline: none;
  }
  #fullscreen-popup:focus-visible {
    border: 2px solid #2B3E5370;
    border-radius: 6px;
  }
  .fullscreen-icon {
    width: 1rem;
  }
  .fullscreen-icon-hidden {
    display: none;
  }      
  #chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  #chat-input-container {
    padding: 0.5rem 0.3rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    background-color: #F3F4F6;
  }
  .input-container {
    padding: 0.1rem 0.5rem 0 0.5rem;
    border-radius: 9999px;
  }
  #chat-input {
    min-height: 42px;
    max-height: 150px;
    height: auto;
    width: 100%;
    padding: 5px;
    background: transparent;
    border: 0;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    outline-style: none;
    transition: height 0.2s ease-in-out;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 16px;
    box-sizing: border-box;
    outline: none;
  }
  textarea, input {
    outline: none;
  }  
  textarea:focus-visible, input:focus-visible {
    outline: none;
  }    
  #chat-input:focus {
    min-height: 42px;
    height: auto;
    outline: none;
  }
  #chat-submit {
    padding: 0.4rem 0.42rem 0.2rem 0.4rem;
    border-radius: 9999px;
    color: #ffffff;
    background-color: #2B3E53;
    cursor: pointer;
    float: right;
    border: none;
    border: 2px solid transparent;
  }
  #chat-submit:focus {
    outline: none;
  }
  #chat-submit:focus-visible {
    border: 2px solid #ffffff70;
  }     
  .user-message-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  .user-message {
    background-color: #2d3748;
    color: #ffffff;
    border-radius: 12px;
    padding: 8px 16px;
    max-width: 70%;
    word-wrap: break-word;
  }
  .chatbot-reply-container {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .chatbot-icon {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    flex-shrink: 0;
    1px solid #d1d5db;
    border-radius: 9999px;
    border: 1px solid #d1d5db;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chatbot-icon-svg {
    width: 1.5rem;
    fill: #2d3748;

  }
  .chatbot-reply {
    background-color: transparent;
    color: #2d3748;
    padding: 8px 16px;
    max-width: 100%;
    word-wrap: break-word;
  }
  #chat-popup.fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    transform: translateX(0);
    transition: transform 0.7s ease-in-out, width 0.5s ease-in-out;
  }
  #chat-messages.fullscreen {
    width: 50%;
    margin: 0 auto;
    padding: 1rem;
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  #chat-input-container.fullscreen {
    width: 50%;
    padding: 0.5rem 0.3rem;
    margin: 0.5rem auto;
  }  
  @media (max-width: 768px) {
    #chat-popup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }
  `

  document.head.appendChild(style)

  const scriptTag = document.currentScript
  //console.log('Parameters: ', scriptTag.dataset)
  const chatBubbleColor = scriptTag.dataset.chatBubbleColor || '#2B3E53'
  const chatBubbleIcon = scriptTag.dataset.chatBubbleIcon || '#FFFFFF'
  const chatBubblePosition = scriptTag.dataset.chatBubblePosition || 'right'

  // Create chat widget container
  const chatWidgetContainer = document.createElement('div')
  chatWidgetContainer.id = 'chat-widget-container'
  document.body.appendChild(chatWidgetContainer)

  // Inject the HTML
  chatWidgetContainer.innerHTML = `
    <button id="chat-bubble" class="chat-bubble" 
      style="background-color: ${chatBubbleColor}; ${chatBubblePosition === 'left' ? 'left: 15px;' : 'right: 15px;'}"
      tabindex="0" role="button" aria-label="Open chat widget"
    >
      <svg class="chat-icon" style="fill: ${chatBubbleIcon}" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.62716 10.016C2.62716 10.0452 2.6273 10.0743 2.62758 10.1034C2.19632 10.1287 1.78703 10.2359 1.41499 10.4095C1.40995 10.279 1.40741 10.1478 1.40741 10.016C1.40741 4.48433 5.89174 0 11.4234 0C16.9552 0 21.4395 4.48433 21.4395 10.016C21.4395 10.1708 21.436 10.3247 21.429 10.4778C21.0608 10.2848 20.6522 10.1584 20.2192 10.1146C20.2196 10.0818 20.2197 10.0489 20.2197 10.016C20.2197 5.15798 16.2815 1.21975 11.4234 1.21975C6.56539 1.21975 2.62716 5.15798 2.62716 10.016ZM11.4 16.9359C10.5909 16.9359 9.73194 16.3212 9.04232 15.0462C8.83443 14.6619 8.64924 14.2289 8.4924 13.756C9.38593 13.9607 10.3685 14.074 11.4001 14.074C12.4315 14.074 13.4141 13.9607 14.3076 13.756C14.1508 14.2289 13.9656 14.6619 13.7577 15.0462C13.0681 16.3212 12.2091 16.9359 11.4 16.9359ZM14.492 13.1313C13.5654 13.3729 12.5169 13.511 11.4001 13.511C10.2832 13.511 9.23468 13.3729 8.30803 13.1313C8.06654 12.2047 7.92841 11.1563 7.92841 10.0396C7.92841 8.92268 8.06657 7.87414 8.30812 6.94748C9.23474 6.70596 10.2832 6.56781 11.4001 6.56781C12.5168 6.56781 13.5653 6.70595 14.4919 6.94745C14.7335 7.87412 14.8716 8.92267 14.8716 10.0396C14.8716 11.1563 14.7335 12.2048 14.492 13.1313ZM14.9495 13.5888C14.531 15.0164 13.8679 16.1631 13.0641 16.8368C13.418 16.752 13.7616 16.6403 14.0924 16.5041C14.1883 16.4432 14.2938 16.3962 14.4061 16.3658C16.3132 15.4684 17.7504 13.7372 18.2477 11.642C17.5817 12.4734 16.4132 13.1597 14.9495 13.5888ZM7.85055 13.5888C8.26571 15.005 8.92159 16.1448 9.71672 16.8206C9.30544 16.7177 8.90855 16.5786 8.52965 16.4067C8.53534 16.3336 8.53825 16.2597 8.53825 16.1852C8.53825 14.6306 7.27801 13.3704 5.72343 13.3704C5.57307 13.3704 5.42546 13.3822 5.28149 13.4049C4.99208 12.8814 4.76764 12.3171 4.61904 11.7227C5.2948 12.5178 6.43448 13.1736 7.85055 13.5888ZM4.72189 13.5538C3.6618 13.9575 2.90862 14.9834 2.90862 16.1852C2.90862 17.7398 4.16885 19 5.72343 19C7.00331 19 8.08367 18.1458 8.42552 16.9764C9.34497 17.373 10.3586 17.5927 11.4235 17.5927C12.1705 17.5927 12.8923 17.4846 13.574 17.2832C13.5635 17.3456 13.558 17.4098 13.558 17.4753C13.558 18.1101 14.0726 18.6247 14.7074 18.6247C15.1565 18.6247 15.5455 18.367 15.7346 17.9914H18.6242C19.3008 17.9914 19.9276 17.636 20.2749 17.0554L20.9705 15.8925C22.0283 15.5792 22.7999 14.6 22.7999 13.4407C22.7999 12.0286 21.6552 10.8839 20.2431 10.8839L20.2197 10.884V15.1372L19.3892 16.5256C19.2282 16.7946 18.9377 16.9593 18.6242 16.9593H15.7347C15.6423 16.7756 15.502 16.6201 15.3302 16.5091C17.5294 15.1831 19.0001 12.7714 19.0001 10.0161C19.0001 5.83173 15.6079 2.4396 11.4235 2.4396C7.23914 2.4396 3.84701 5.83173 3.84701 10.0161C3.84701 11.2939 4.16331 12.4978 4.72189 13.5538ZM7.85065 6.49001C6.42326 6.90847 5.27668 7.57149 4.60299 8.37516C5.21676 5.81478 7.2348 3.80047 9.79726 3.19207C8.96595 3.8581 8.27975 5.02643 7.85065 6.49001ZM12.9834 3.17664C15.6044 3.77188 17.6676 5.83508 18.263 8.45606C17.5996 7.61598 16.4244 6.9224 14.9494 6.48997C14.5169 5.01504 13.8234 3.83995 12.9834 3.17664ZM15.1165 7.13182C15.5894 7.28866 16.0224 7.47383 16.4067 7.68171C17.6817 8.37134 18.2964 9.23033 18.2964 10.0394C18.2964 10.8485 17.6817 11.7075 16.4067 12.3971C16.0224 12.605 15.5895 12.7901 15.1166 12.947C15.3214 12.0535 15.4346 11.071 15.4346 10.0396C15.4346 9.00801 15.3213 8.02537 15.1165 7.13182ZM14.3075 6.32281C14.1507 5.85003 13.9656 5.41716 13.7577 5.0329C13.0681 3.7579 12.2091 3.14327 11.4 3.14327C10.5909 3.14327 9.73194 3.7579 9.04232 5.0329C8.83447 5.41717 8.64932 5.85004 8.4925 6.32284C9.386 6.11809 10.3686 6.00485 11.4001 6.00485C12.4315 6.00485 13.414 6.11808 14.3075 6.32281ZM7.68347 7.13186C7.21063 7.28869 6.77771 7.47385 6.3934 7.68171C5.1184 8.37134 4.50377 9.23033 4.50377 10.0394C4.50377 10.8485 5.1184 11.7075 6.3934 12.3971C6.77769 12.605 7.21058 12.7901 7.6834 12.9469C7.47868 12.0535 7.36545 11.071 7.36545 10.0396C7.36545 9.00803 7.4787 8.0254 7.68347 7.13186ZM2.58025 10.884L2.55679 10.8839C1.14471 10.8839 0 12.0286 0 13.4407C0 14.8527 1.14471 15.9974 2.55679 15.9974L2.58025 15.9973V10.884ZM9.00744 8.96042C9.00744 8.83088 9.11246 8.72586 9.24201 8.72586H13.2297C13.3592 8.72586 13.4642 8.83088 13.4642 8.96042V10.3879C13.4642 10.4057 13.4663 10.4235 13.4703 10.4409L13.7508 11.6506C13.7909 11.8235 13.6318 11.9766 13.4606 11.9299L12.5797 11.6897C12.5596 11.6842 12.5388 11.6814 12.518 11.6814H9.24201C9.11246 11.6814 9.00744 11.5764 9.00744 11.4468V8.96042ZM12.9482 10.1098C12.9482 10.33 12.7696 10.5086 12.5494 10.5086C12.3292 10.5086 12.1506 10.33 12.1506 10.1098C12.1506 9.88957 12.3292 9.71104 12.5494 9.71104C12.7696 9.71104 12.9482 9.88957 12.9482 10.1098ZM11.3766 10.5086C11.5968 10.5086 11.7753 10.33 11.7753 10.1098C11.7753 9.88957 11.5968 9.71104 11.3766 9.71104C11.1563 9.71104 10.9778 9.88957 10.9778 10.1098C10.9778 10.33 11.1563 10.5086 11.3766 10.5086ZM10.5087 10.1098C10.5087 10.33 10.3301 10.5086 10.1099 10.5086C9.88968 10.5086 9.71114 10.33 9.71114 10.1098C9.71114 9.88957 9.88968 9.71104 10.1099 9.71104C10.3301 9.71104 10.5087 9.88957 10.5087 10.1098ZM5.29067 16.6791L4.61664 15.9088C4.58089 15.868 4.51806 15.8659 4.47968 15.9042L4.09445 16.2895C4.06042 16.3235 4.05765 16.3778 4.08803 16.4151L5.01775 17.5568C5.19499 17.7745 5.53134 17.7618 5.6917 17.5314L7.35994 15.1345C7.38906 15.0927 7.37945 15.0352 7.33829 15.0052L6.88173 14.6715C6.83854 14.64 6.77774 14.6508 6.74818 14.6954L5.43948 16.6692C5.40529 16.7208 5.33141 16.7257 5.29067 16.6791Z"/>
      </svg>
      <div class="chat-text" style="color: ${chatBubbleIcon}">Help</div>
    </button>
    <div id="chat-popup" class="hidden">
      <div id="chat-header" >
       <button id="fullscreen-popup" aria-label="Open chat widget fullscreen way">
          <svg id="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" class="fullscreen-icon"  viewBox="0 0 512 512">
            <path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/>
          </svg>
          <svg id="fullscreen-exit-icon" xmlns="http://www.w3.org/2000/svg" class="fullscreen-icon fullscreen-icon-hidden" viewBox="0 0 512 512">
            <path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"/>
          </svg> 
        </button>
        <button id="close-popup" aria-label="Close chat widget">
          <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" viewBox="0 0 512 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-container">
        <div class="input-container">
          <textarea type="text" id="chat-input" placeholder="Type your message..."></textarea>
          <button id="chat-submit">
            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 384 512">
              <path fill="#ffffff" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `

  // AWS.config.region = 'us-east-1'; // Region
  // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //   IdentityPoolId: scriptTag.dataset.identityPoolId,
  // });

  AWS.config.update({
    region: scriptTag.dataset.region,
    accessKeyId: scriptTag.dataset.accessKeyId,
    secretAccessKey: scriptTag.dataset.secretAccessKey,
  })

  AWS.config.credentials.get((err) => {
    if (err) {
      console.error('Error obtaining Cognito Identity credentials:', err)
    } else {
      console.log('Cognito Identity credentials obtained successfully:', AWS.config.credentials)
    }
  })

  const lexRuntimeV2 = new AWS.LexRuntimeV2()
  const botId = scriptTag.dataset.botId
  const botAliasId = scriptTag.dataset.botAliasId
  const localeId = scriptTag.dataset.localeId || 'en_US'
  let sessionId = 'user-' + Date.now()
  let sessionState = {}

  // Add event listeners
  const chatInput = document.getElementById('chat-input')
  const chatSubmit = document.getElementById('chat-submit')
  const chatMessages = document.getElementById('chat-messages')
  const chatBubble = document.getElementById('chat-bubble')
  const chatPopup = document.getElementById('chat-popup')
  const closePopup = document.getElementById('close-popup')
  const fullscreenPopup = document.getElementById('fullscreen-popup')
  const chatInputContainer = document.getElementById('chat-input-container')
  const fullscreenIcon = document.getElementById('fullscreen-icon')
  const fullscreenExitIcon = document.getElementById('fullscreen-exit-icon')

  fullscreenPopup.addEventListener('click', function () {
    if (!chatPopup.classList.contains('fullscreen')) {
      chatPopup.classList.add('fullscreen')
      chatMessages.classList.add('fullscreen')
      chatInputContainer.classList.add('fullscreen')
      fullscreenIcon.classList.add('fullscreen-icon-hidden')
      fullscreenExitIcon.classList.remove('fullscreen-icon-hidden')
    } else {
      chatPopup.classList.remove('fullscreen')
      chatMessages.classList.remove('fullscreen')
      chatInputContainer.classList.remove('fullscreen')
      fullscreenIcon.classList.remove('fullscreen-icon-hidden')
      fullscreenExitIcon.classList.add('fullscreen-icon-hidden')
    }
  })

  chatSubmit.addEventListener('click', function () {
    const message = chatInput.value.trim()
    if (!message) return
    chatMessages.scrollTop = chatMessages.scrollHeight
    chatInput.value = ''
    onUserRequest(message)
    resetTextarea()
    chatInput.focus()
  })

  chatInput.addEventListener('input', function () {
    this.style.height = 'auto'
    this.style.height = `${this.scrollHeight}px`
  })

  chatInput.addEventListener('focus', function () {
    this.style.height = 'auto'
    this.style.height = `${this.scrollHeight}px`
  })

  function resetTextarea() {
    const minHeight = 42
    chatInput.style.height = `${minHeight}px`
    chatInput.style.height = `${this.scrollHeight}px`
    chatInput.value = ''
  }

  chatInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      chatSubmit.click()
      resetTextarea()
    }
  })

  chatBubble.addEventListener('click', function () {
    togglePopup()
    chatInput.focus()
  })

  closePopup.addEventListener('click', function () {
    togglePopup()
    chatMessages.innerHTML = ''
    chatInput.value = ''
    chatMessages.classList.remove('fullscreen')
    chatInputContainer.classList.remove('fullscreen')
    chatPopup.classList.remove('fullscreen')
    fullscreenIcon.classList.remove('fullscreen-icon-hidden')
    fullscreenExitIcon.classList.add('fullscreen-icon-hidden')
  })

  function togglePopup() {
    const chatPopup = document.getElementById('chat-popup')
    const chatBubble = document.getElementById('chat-bubble')
    chatPopup.classList.toggle('hidden')
    if (!chatPopup.classList.contains('hidden')) {
      document.getElementById('chat-input').focus()
      chatBubble.classList.add('hidden')
      chatPopup.classList.add('visible')
    } else {
      chatBubble.classList.remove('hidden')
      chatBubble.classList.add('visible')
      chatPopup.classList.remove('visible')
    }
  }

  document.getElementById('chatPopup').addEventListener('keydown', (event) => {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const modal = document.getElementById('chatPopup')
    const focusableContent = modal.querySelectorAll(focusableElements)
    const firstElement = focusableContent[0]
    const lastElement = focusableContent[focusableContent.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  });

  function onUserRequest(message) {
    console.log('User request:', message)
    const messageElement = document.createElement('div')
    messageElement.className = 'user-message-container'
    messageElement.innerHTML = `
      <div class="user-message">
        ${message}
      </div>
    `
    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight

    chatInput.value = ''

    const params = {
      botId: botId,
      botAliasId: botAliasId,
      localeId: localeId,
      sessionId: sessionId,
      text: message,
      sessionState: sessionState
    }
    console.log('Send message to lex: ', params)

    // Send message to Lex
    lexRuntimeV2.recognizeText(params, function (err, data) {
      if (err) {
        console.error(err, err.stack)
        reply('Error: ' + err.message)
      } else {
        console.log('Recevied message from lex: ', data)
        sessionState = data.sessionState || {}
        const botMessage = data.messages?.[0]?.content || 'No response from bot.'
        reply(botMessage)
      }
    })
  }

  function reply(message) {
    const chatMessages = document.getElementById('chat-messages')
    const replyElement = document.createElement('div')
    replyElement.className = 'chatbot-reply-container'
    replyElement.innerHTML = `
      <div class="chatbot-icon">
        <svg class="chatbot-icon-svg" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.62716 10.016C2.62716 10.0452 2.6273 10.0743 2.62758 10.1034C2.19632 10.1287 1.78703 10.2359 1.41499 10.4095C1.40995 10.279 1.40741 10.1478 1.40741 10.016C1.40741 4.48433 5.89174 0 11.4234 0C16.9552 0 21.4395 4.48433 21.4395 10.016C21.4395 10.1708 21.436 10.3247 21.429 10.4778C21.0608 10.2848 20.6522 10.1584 20.2192 10.1146C20.2196 10.0818 20.2197 10.0489 20.2197 10.016C20.2197 5.15798 16.2815 1.21975 11.4234 1.21975C6.56539 1.21975 2.62716 5.15798 2.62716 10.016ZM11.4 16.9359C10.5909 16.9359 9.73194 16.3212 9.04232 15.0462C8.83443 14.6619 8.64924 14.2289 8.4924 13.756C9.38593 13.9607 10.3685 14.074 11.4001 14.074C12.4315 14.074 13.4141 13.9607 14.3076 13.756C14.1508 14.2289 13.9656 14.6619 13.7577 15.0462C13.0681 16.3212 12.2091 16.9359 11.4 16.9359ZM14.492 13.1313C13.5654 13.3729 12.5169 13.511 11.4001 13.511C10.2832 13.511 9.23468 13.3729 8.30803 13.1313C8.06654 12.2047 7.92841 11.1563 7.92841 10.0396C7.92841 8.92268 8.06657 7.87414 8.30812 6.94748C9.23474 6.70596 10.2832 6.56781 11.4001 6.56781C12.5168 6.56781 13.5653 6.70595 14.4919 6.94745C14.7335 7.87412 14.8716 8.92267 14.8716 10.0396C14.8716 11.1563 14.7335 12.2048 14.492 13.1313ZM14.9495 13.5888C14.531 15.0164 13.8679 16.1631 13.0641 16.8368C13.418 16.752 13.7616 16.6403 14.0924 16.5041C14.1883 16.4432 14.2938 16.3962 14.4061 16.3658C16.3132 15.4684 17.7504 13.7372 18.2477 11.642C17.5817 12.4734 16.4132 13.1597 14.9495 13.5888ZM7.85055 13.5888C8.26571 15.005 8.92159 16.1448 9.71672 16.8206C9.30544 16.7177 8.90855 16.5786 8.52965 16.4067C8.53534 16.3336 8.53825 16.2597 8.53825 16.1852C8.53825 14.6306 7.27801 13.3704 5.72343 13.3704C5.57307 13.3704 5.42546 13.3822 5.28149 13.4049C4.99208 12.8814 4.76764 12.3171 4.61904 11.7227C5.2948 12.5178 6.43448 13.1736 7.85055 13.5888ZM4.72189 13.5538C3.6618 13.9575 2.90862 14.9834 2.90862 16.1852C2.90862 17.7398 4.16885 19 5.72343 19C7.00331 19 8.08367 18.1458 8.42552 16.9764C9.34497 17.373 10.3586 17.5927 11.4235 17.5927C12.1705 17.5927 12.8923 17.4846 13.574 17.2832C13.5635 17.3456 13.558 17.4098 13.558 17.4753C13.558 18.1101 14.0726 18.6247 14.7074 18.6247C15.1565 18.6247 15.5455 18.367 15.7346 17.9914H18.6242C19.3008 17.9914 19.9276 17.636 20.2749 17.0554L20.9705 15.8925C22.0283 15.5792 22.7999 14.6 22.7999 13.4407C22.7999 12.0286 21.6552 10.8839 20.2431 10.8839L20.2197 10.884V15.1372L19.3892 16.5256C19.2282 16.7946 18.9377 16.9593 18.6242 16.9593H15.7347C15.6423 16.7756 15.502 16.6201 15.3302 16.5091C17.5294 15.1831 19.0001 12.7714 19.0001 10.0161C19.0001 5.83173 15.6079 2.4396 11.4235 2.4396C7.23914 2.4396 3.84701 5.83173 3.84701 10.0161C3.84701 11.2939 4.16331 12.4978 4.72189 13.5538ZM7.85065 6.49001C6.42326 6.90847 5.27668 7.57149 4.60299 8.37516C5.21676 5.81478 7.2348 3.80047 9.79726 3.19207C8.96595 3.8581 8.27975 5.02643 7.85065 6.49001ZM12.9834 3.17664C15.6044 3.77188 17.6676 5.83508 18.263 8.45606C17.5996 7.61598 16.4244 6.9224 14.9494 6.48997C14.5169 5.01504 13.8234 3.83995 12.9834 3.17664ZM15.1165 7.13182C15.5894 7.28866 16.0224 7.47383 16.4067 7.68171C17.6817 8.37134 18.2964 9.23033 18.2964 10.0394C18.2964 10.8485 17.6817 11.7075 16.4067 12.3971C16.0224 12.605 15.5895 12.7901 15.1166 12.947C15.3214 12.0535 15.4346 11.071 15.4346 10.0396C15.4346 9.00801 15.3213 8.02537 15.1165 7.13182ZM14.3075 6.32281C14.1507 5.85003 13.9656 5.41716 13.7577 5.0329C13.0681 3.7579 12.2091 3.14327 11.4 3.14327C10.5909 3.14327 9.73194 3.7579 9.04232 5.0329C8.83447 5.41717 8.64932 5.85004 8.4925 6.32284C9.386 6.11809 10.3686 6.00485 11.4001 6.00485C12.4315 6.00485 13.414 6.11808 14.3075 6.32281ZM7.68347 7.13186C7.21063 7.28869 6.77771 7.47385 6.3934 7.68171C5.1184 8.37134 4.50377 9.23033 4.50377 10.0394C4.50377 10.8485 5.1184 11.7075 6.3934 12.3971C6.77769 12.605 7.21058 12.7901 7.6834 12.9469C7.47868 12.0535 7.36545 11.071 7.36545 10.0396C7.36545 9.00803 7.4787 8.0254 7.68347 7.13186ZM2.58025 10.884L2.55679 10.8839C1.14471 10.8839 0 12.0286 0 13.4407C0 14.8527 1.14471 15.9974 2.55679 15.9974L2.58025 15.9973V10.884ZM9.00744 8.96042C9.00744 8.83088 9.11246 8.72586 9.24201 8.72586H13.2297C13.3592 8.72586 13.4642 8.83088 13.4642 8.96042V10.3879C13.4642 10.4057 13.4663 10.4235 13.4703 10.4409L13.7508 11.6506C13.7909 11.8235 13.6318 11.9766 13.4606 11.9299L12.5797 11.6897C12.5596 11.6842 12.5388 11.6814 12.518 11.6814H9.24201C9.11246 11.6814 9.00744 11.5764 9.00744 11.4468V8.96042ZM12.9482 10.1098C12.9482 10.33 12.7696 10.5086 12.5494 10.5086C12.3292 10.5086 12.1506 10.33 12.1506 10.1098C12.1506 9.88957 12.3292 9.71104 12.5494 9.71104C12.7696 9.71104 12.9482 9.88957 12.9482 10.1098ZM11.3766 10.5086C11.5968 10.5086 11.7753 10.33 11.7753 10.1098C11.7753 9.88957 11.5968 9.71104 11.3766 9.71104C11.1563 9.71104 10.9778 9.88957 10.9778 10.1098C10.9778 10.33 11.1563 10.5086 11.3766 10.5086ZM10.5087 10.1098C10.5087 10.33 10.3301 10.5086 10.1099 10.5086C9.88968 10.5086 9.71114 10.33 9.71114 10.1098C9.71114 9.88957 9.88968 9.71104 10.1099 9.71104C10.3301 9.71104 10.5087 9.88957 10.5087 10.1098ZM5.29067 16.6791L4.61664 15.9088C4.58089 15.868 4.51806 15.8659 4.47968 15.9042L4.09445 16.2895C4.06042 16.3235 4.05765 16.3778 4.08803 16.4151L5.01775 17.5568C5.19499 17.7745 5.53134 17.7618 5.6917 17.5314L7.35994 15.1345C7.38906 15.0927 7.37945 15.0352 7.33829 15.0052L6.88173 14.6715C6.83854 14.64 6.77774 14.6508 6.74818 14.6954L5.43948 16.6692C5.40529 16.7208 5.33141 16.7257 5.29067 16.6791Z"/>
        </svg>
      </div>
      <div class="chatbot-reply">
        ${message}
      </div>
    `
    chatMessages.appendChild(replyElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

})()
