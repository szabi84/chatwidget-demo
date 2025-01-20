(function () {

  // Inject the CSS
  const style = document.createElement('style')
  style.innerHTML = `
  .hidden {
    opacity: 0; /* Elhalványítja az elemet */
    visibility: hidden; /* Láthatatlanná teszi, de az elem a DOM-ban marad */
    pointer-events: none; /* Klikkelhetővé sem válik */
  }
  .visible {
    opacity: 1; /* Újra láthatóvá teszi az elemet */
    visibility: visible; /* Láthatóvá teszi */
    pointer-events: auto; /* Engedélyezi a kattintásokat */
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
    bottom: 20px;
    right: 20px;
    transform: translateY(0); /* Alapértelmezett helyzet */
    transition: transform 1s ease-in-out, opacity 1s ease-in-out; /* Animáció */
    opacity: 1; /* Teljesen látható */
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    font-size: 1.875rem;
    line-height: 2.25rem;
    background-color: #1F2937;
    cursor: pointer;
  }
  .chat-icon{
    width: 1.5rem;
    fill: #fff;
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
    transform: translateX(0); /* Jobbról belép */
  }
  #chat-header {
    display: block;
    padding: 0.5rem;
    text-align: right;
    color: #ffffff;
  }
  #close-popup {
    border-style: none;
    color: gray;
    background-color: transparent;
    cursor: pointer;
  }
  .close-icon {
    width: 1.2rem;
  }
  #fullscreen-popup {
    border-style: none;
    color: gray;
    background-color: transparent;
    cursor: pointer;
  }
  .fullscreen-icon {
    width: 1.2rem;
    position: relative;
    top: -3px;
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
  }
  #chat-input:focus {
    outline: none;
    min-height: 42px;
    height: auto;
  }
  #chat-submit {
    padding: 0.4rem 0.42rem 0.2rem 0.4rem;
    border-radius: 9999px;
    color: #ffffff;
    background-color: #1F2937;
    cursor: pointer;
    float: right;
    border: none;
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
    width: 1rem;
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

  // Create chat widget container
  const chatWidgetContainer = document.createElement('div')
  chatWidgetContainer.id = 'chat-widget-container'
  document.body.appendChild(chatWidgetContainer)

  // Inject the HTML
  chatWidgetContainer.innerHTML = `
    <div id="chat-bubble" class="chat-bubble">
      <svg class="chat-icon" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 3.58173 3.58173 0 8 0H36C40.4183 0 44 3.58173 44 8V36C44 39.9183 41.183 43.1786 37.4639 43.8664L35.366 47.5C34.9811 48.1667 34.0189 48.1667 33.634 47.5L31.6133 44H8C3.58173 44 0 40.4183 0 36V8ZM11.0169 22.6665C10.9271 22.2176 10.4904 21.9265 10.0415 22.0163C9.59259 22.106 9.30139 22.5428 9.39117 22.9917C9.59003 23.9858 9.37256 26.7381 6.37378 28.7087C5.99121 28.9602 5.88489 29.4742 6.13629 29.8568C6.3877 30.2393 6.90167 30.3457 7.2843 30.0943C8.36615 29.3833 9.16254 28.5765 9.73926 27.7524C12.7043 30.6961 19.4324 36.566 22.6976 36.566C25.9263 36.566 32.3096 30.8267 35.2042 27.8523C35.7747 28.6416 36.55 29.4121 37.5881 30.0943C37.9707 30.3457 38.4847 30.2393 38.7361 29.8568C38.9875 29.4742 38.8812 28.9602 38.4985 28.7087C35.4998 26.7381 35.2823 23.9858 35.4811 22.9917C35.5709 22.5428 35.2798 22.106 34.8309 22.0163C34.382 21.9265 33.9453 22.2176 33.8555 22.6665C33.7245 23.3211 33.72 24.3046 34.0216 25.402L34.0068 25.3752C33.0397 26.6186 29.3647 29.1055 22.4016 29.1055C15.5442 29.1055 11.8759 26.6936 10.8422 25.4328C11.1525 24.323 11.149 23.3271 11.0169 22.6665Z"/>
      </svg>
    </div>
    <div id="chat-popup" class="hidden">
      <div id="chat-header" >
       <button id="fullscreen-popup">
          <svg id="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" class="fullscreen-icon"  viewBox="0 0 512 512">
            <path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/>
          </svg>
          <svg id="fullscreen-exit-icon" xmlns="http://www.w3.org/2000/svg" class="fullscreen-icon fullscreen-icon-hidden" viewBox="0 0 512 512">
            <path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"/>
          </svg> 
        </button>
        <button id="close-popup">
          <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" viewBox="0 0 384 512">
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

  const scriptTag = document.currentScript
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
        <svg class="chatbot-icon-svg" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 3.58173 3.58173 0 8 0H36C40.4183 0 44 3.58173 44 8V36C44 39.9183 41.183 43.1786 37.4639 43.8664L35.366 47.5C34.9811 48.1667 34.0189 48.1667 33.634 47.5L31.6133 44H8C3.58173 44 0 40.4183 0 36V8ZM11.0169 22.6665C10.9271 22.2176 10.4904 21.9265 10.0415 22.0163C9.59259 22.106 9.30139 22.5428 9.39117 22.9917C9.59003 23.9858 9.37256 26.7381 6.37378 28.7087C5.99121 28.9602 5.88489 29.4742 6.13629 29.8568C6.3877 30.2393 6.90167 30.3457 7.2843 30.0943C8.36615 29.3833 9.16254 28.5765 9.73926 27.7524C12.7043 30.6961 19.4324 36.566 22.6976 36.566C25.9263 36.566 32.3096 30.8267 35.2042 27.8523C35.7747 28.6416 36.55 29.4121 37.5881 30.0943C37.9707 30.3457 38.4847 30.2393 38.7361 29.8568C38.9875 29.4742 38.8812 28.9602 38.4985 28.7087C35.4998 26.7381 35.2823 23.9858 35.4811 22.9917C35.5709 22.5428 35.2798 22.106 34.8309 22.0163C34.382 21.9265 33.9453 22.2176 33.8555 22.6665C33.7245 23.3211 33.72 24.3046 34.0216 25.402L34.0068 25.3752C33.0397 26.6186 29.3647 29.1055 22.4016 29.1055C15.5442 29.1055 11.8759 26.6936 10.8422 25.4328C11.1525 24.323 11.149 23.3271 11.0169 22.6665Z"/>
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
