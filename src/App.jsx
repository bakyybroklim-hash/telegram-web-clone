import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const navItems = [
  { id: 'all', icon: 'inbox', label: 'All chats' },
  { id: 'personal', icon: 'user', label: 'Personal' },
  { id: 'groups', icon: 'group', label: 'Groups' },
  { id: 'channels', icon: 'cast', label: 'Channels' },
  { id: 'bots', icon: 'bot', label: 'Bots' },
  { id: 'favorites', icon: 'star', label: 'Favorites' },
  { id: 'calls', icon: 'call', label: 'Calls' },
  { id: 'contacts', icon: 'book', label: 'Contacts' },
]

const initialChats = [
  {
    id: 1,
    name: 'Ayan Design Lab',
    type: 'groups',
    status: '12 members online',
    avatar: 'AD',
    accent: '#24a1de',
    online: true,
    pinned: true,
    muted: false,
    unread: 8,
    time: '23:18',
    preview: 'Prototype for the premium chat shell is ready.',
    messages: [
      { id: 1, from: 'them', author: 'Ayan', text: 'The chat shell needs to feel fast and quiet.', time: '23:04', reactions: ['thumb'] },
      { id: 2, from: 'me', text: 'I added compact panels, smooth hover states and responsive mobile mode.', time: '23:10', read: true, reactions: ['spark'] },
      { id: 3, from: 'them', author: 'Mira', text: 'Great. Add file drop feedback and quick AI actions too.', time: '23:18', reactions: [] },
    ],
    attachments: ['Brand brief.pdf', 'wireframe.png', 'release-notes.md'],
  },
  {
    id: 2,
    name: 'Saved Messages',
    type: 'favorites',
    status: 'private cloud',
    avatar: 'SM',
    accent: '#22c55e',
    online: false,
    pinned: true,
    muted: false,
    unread: 0,
    time: '22:41',
    preview: 'Production checklist: auth, realtime, storage, PWA.',
    messages: [
      { id: 1, from: 'me', text: 'Production checklist: auth, realtime, storage, PWA.', time: '22:41', read: true, reactions: [] },
      { id: 2, from: 'me', text: 'Keep the app usable even without backend credentials.', time: '22:45', read: true, reactions: ['check'] },
    ],
    attachments: ['schema.json', 'firebase-rules.txt'],
  },
  {
    id: 3,
    name: 'Product Channel',
    type: 'channels',
    status: '18.2K subscribers',
    avatar: 'PC',
    accent: '#f59e0b',
    online: true,
    pinned: false,
    muted: true,
    unread: 24,
    time: '21:09',
    preview: 'New post scheduled for tomorrow morning.',
    messages: [
      { id: 1, from: 'them', author: 'Channel', text: 'New post scheduled for tomorrow morning.', time: '21:09', reactions: ['fire', 'eye'] },
      { id: 2, from: 'me', text: 'Pin the launch note and open analytics after publish.', time: '21:12', read: true, reactions: [] },
    ],
    attachments: ['analytics.csv', 'post-cover.webp'],
  },
  {
    id: 4,
    name: 'Nika',
    type: 'personal',
    status: 'online',
    avatar: 'NK',
    accent: '#8b5cf6',
    online: true,
    pinned: false,
    muted: false,
    unread: 3,
    time: '20:32',
    preview: 'Can you send the final dark theme colors?',
    messages: [
      { id: 1, from: 'them', author: 'Nika', text: 'Can you send the final dark theme colors?', time: '20:32', reactions: [] },
      { id: 2, from: 'me', text: '#0E1721, #17212B, #182533, #5288C1. It feels close to Telegram but cleaner.', time: '20:34', read: true, reactions: ['heart'] },
    ],
    attachments: ['theme-tokens.css'],
  },
  {
    id: 5,
    name: 'Build Bot',
    type: 'bots',
    status: 'deploy assistant',
    avatar: 'BB',
    accent: '#ef4444',
    online: false,
    pinned: false,
    muted: false,
    unread: 1,
    time: '19:58',
    preview: 'Build passed in 18s. Preview is live.',
    messages: [
      { id: 1, from: 'them', author: 'Build Bot', text: 'Build passed in 18s. Preview is live.', time: '19:58', reactions: ['check'] },
    ],
    attachments: ['build-log.txt'],
  },
]

const featureCards = [
  ['AI Assistant', 'Summarize chats, translate messages, polish replies and generate content from the active thread.'],
  ['Security', 'Firebase Auth ready structure, device sessions, 2FA surface, anti-spam and privacy controls.'],
  ['Calls', 'Audio, video, screen share and group call surfaces prepared for WebRTC integration.'],
  ['Admin', 'Users, groups, reports, analytics and moderation panels in a compact operations view.'],
]

const emojiSet = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🎉', '😎', '🙏', '💬', '🚀', '✅']

const storageKey = 'telegram-ultra-state-v1'

const defaultSettings = {
  accent: '#24a1de',
  fontSize: 16,
  privacy: true,
  notifications: false,
}

const keyboardLayouts = {
  ky: {
    label: 'Кыргызча',
    rows: [
      ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х'],
      ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
      ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю'],
    ],
  },
  ru: {
    label: 'Русский',
    rows: [
      ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х'],
      ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
      ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю'],
    ],
  },
  en: {
    label: 'English',
    rows: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ],
  },
}

function Icon({ name }) {
  const icons = {
    inbox: 'M4 6h16v12H4z M4 10h5l2 3h2l2-3h5',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
    group: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2 21a6 6 0 0 1 12 0 M10 21a6 6 0 0 1 12 0',
    cast: 'M5 7h14v10H5z M8 20h8 M12 17v3',
    bot: 'M7 8h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z M9 3v5 M15 3v5 M9 14h.01 M15 14h.01',
    star: 'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z',
    call: 'M5 4l4 4-2 2c1.4 2.7 3.3 4.6 6 6l2-2 4 4-2 3c-8-.3-14.7-7-15-15z',
    book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M8 4v16',
    search: 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z M16 16l5 5',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 12h2 M18 12h2 M12 4v2 M12 18v2 M6.3 6.3l1.4 1.4 M16.3 16.3l1.4 1.4 M17.7 6.3l-1.4 1.4 M7.7 16.3l-1.4 1.4',
    archive: 'M4 7h16v4H4z M6 11v8h12v-8 M10 15h4',
    moon: 'M20 15.5A8 8 0 0 1 8.5 4 7 7 0 1 0 20 15.5z',
    sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
    pin: 'M15 4l5 5-4 1-4 7-2-2 7-4z M9 15l-5 5',
    mute: 'M4 10h4l5-4v12l-5-4H4z M17 9l4 6 M21 9l-4 6',
    more: 'M5 12h.01 M12 12h.01 M19 12h.01',
    attach: 'M21 10l-9.5 9.5a5 5 0 0 1-7-7L14 3a3 3 0 0 1 4 4L8.5 16.5a1 1 0 0 1-1.5-1.5L16 6',
    emoji: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9 10h.01 M15 10h.01 M8 14c1 2 3 3 4 3s3-1 4-3',
    reply: 'M10 8V4l-7 7 7 7v-4h4a7 7 0 0 1 7 7 9 9 0 0 0-9-13z',
    edit: 'M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z M13 6l5 5',
    trash: 'M4 7h16 M10 11v6 M14 11v6 M6 7l1 14h10l1-14 M9 7l1-3h4l1 3',
    mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v4',
    send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
    back: 'M15 18l-6-6 6-6',
    video: 'M4 6h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4z M17 10l5-3v10l-5-3',
    shield: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z',
    logout: 'M10 17l5-5-5-5 M15 12H3 M21 4v16',
    close: 'M6 6l12 12 M18 6L6 18',
    plus: 'M12 5v14 M5 12h14',
    file: 'M7 3h7l5 5v13H7z M14 3v6h5',
  }

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      <path d={icons[name]} />
    </svg>
  )
}

function readSavedState() {
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function cleanChatsForStorage(chats) {
  return chats.map((chat) => ({
    ...chat,
    messages: chat.messages.map((message) => {
      const item = { ...message }
      delete item.audioUrl
      delete item.fileUrl
      return item
    }),
  }))
}

function getMessagePreview(message) {
  if (!message) return 'No messages yet'
  if (message.type === 'voice') return 'Voice message'
  return message.fileName ?? message.text
}

function App() {
  const savedState = useMemo(() => readSavedState(), [])
  const [theme, setTheme] = useState(savedState?.theme ?? 'light')
  const [activeNav, setActiveNav] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('priority')
  const [chats, setChats] = useState(savedState?.chats?.length ? savedState.chats : initialChats)
  const [activeChatId, setActiveChatId] = useState(savedState?.activeChatId ?? 1)
  const [message, setMessage] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardLanguage, setKeyboardLanguage] = useState(savedState?.keyboardLanguage ?? 'ky')
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const [chatSearch, setChatSearch] = useState('')
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [panel, setPanel] = useState('settings')
  const [mobileListOpen, setMobileListOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [toast, setToast] = useState('Ready')
  const [settings, setSettings] = useState({ ...defaultSettings, ...savedState?.settings })
  const [contactOpen, setContactOpen] = useState(false)
  const [callState, setCallState] = useState(null)
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [newChatName, setNewChatName] = useState('')
  const messageInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const languageHoldTimer = useRef(null)
  const languageLongPressedRef = useRef(false)
  const recorderRef = useRef(null)
  const voiceChunksRef = useRef([])
  const voiceStreamRef = useRef(null)
  const voiceUrlsRef = useRef([])
  const fileUrlsRef = useRef([])
  const nextIdRef = useRef(100000)

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0]
  const currentKeyboard = keyboardLayouts[keyboardLanguage]
  const pinnedMessage = activeChat.messages.find((item) => item.pinned) ?? activeChat.messages[0]
  const visibleMessages = useMemo(() => {
    const normalized = chatSearch.trim().toLowerCase()
    if (!normalized) return activeChat.messages
    return activeChat.messages.filter((item) => `${item.author ?? ''} ${item.text}`.toLowerCase().includes(normalized))
  }, [activeChat.messages, chatSearch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeChat?.messages.length, activeChatId])

  useEffect(() => {
    return () => {
      window.clearTimeout(languageHoldTimer.current)
      voiceStreamRef.current?.getTracks().forEach((track) => track.stop())
      voiceUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      fileUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  useEffect(() => {
    const payload = {
      activeChatId,
      chats: cleanChatsForStorage(chats),
      keyboardLanguage,
      settings,
      theme,
    }
    window.localStorage.setItem(storageKey, JSON.stringify(payload))
  }, [activeChatId, chats, keyboardLanguage, settings, theme])

  const filteredChats = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return chats
      .filter((chat) => activeNav === 'all' || chat.type === activeNav || (activeNav === 'calls' && chat.online))
      .filter((chat) => !normalized || `${chat.name} ${chat.preview} ${chat.status}`.toLowerCase().includes(normalized))
      .sort((a, b) => {
        if (sort === 'unread') return b.unread - a.unread
        if (sort === 'name') return a.name.localeCompare(b.name)
        return Number(b.pinned) - Number(a.pinned) || b.unread - a.unread
      })
  }, [activeNav, chats, query, sort])

  const totals = useMemo(
    () => ({
      unread: chats.reduce((total, chat) => total + chat.unread, 0),
      online: chats.filter((chat) => chat.online).length,
      pinned: chats.filter((chat) => chat.pinned).length,
    }),
    [chats],
  )

  function notify(text) {
    setToast(text)
    window.clearTimeout(notify.timer)
    notify.timer = window.setTimeout(() => setToast('Ready'), 2200)
  }

  function makeId() {
    nextIdRef.current += 1
    return nextIdRef.current
  }

  function selectChat(id) {
    setActiveChatId(id)
    setMobileListOpen(false)
    setReplyTo(null)
    setEditingMessageId(null)
    setEmojiOpen(false)
    if (messageInputRef.current) {
      messageInputRef.current.style.height = '38px'
    }
    setChats((items) => items.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)))
  }

  function togglePin(id) {
    setChats((items) => items.map((chat) => (chat.id === id ? { ...chat, pinned: !chat.pinned } : chat)))
    notify('Chat pin updated')
  }

  function toggleMute(id) {
    setChats((items) => items.map((chat) => (chat.id === id ? { ...chat, muted: !chat.muted } : chat)))
    notify('Notification mode updated')
  }

  function archiveChat(id) {
    if (chats.length <= 1) {
      notify('At least one chat is required')
      return
    }
    setChats((items) => {
      const next = items.filter((chat) => chat.id !== id)
      if (id === activeChatId && next[0]) {
        setActiveChatId(next[0].id)
      }
      return next
    })
    notify('Chat archived')
  }

  function createChat(type = 'personal') {
    const name = newChatName.trim()
    if (!name) return
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    const newChat = {
      id: makeId(),
      name,
      type,
      status: type === 'channels' ? 'new channel' : type === 'groups' ? 'new group' : 'online',
      avatar: initials || 'NC',
      accent: settings.accent,
      online: true,
      pinned: false,
      muted: false,
      unread: 0,
      time: 'now',
      preview: 'New chat created',
      messages: [],
      attachments: [],
    }
    setChats((items) => [newChat, ...items])
    setActiveChatId(newChat.id)
    setNewChatName('')
    setNewChatOpen(false)
    setMobileListOpen(false)
    notify('New chat created')
  }

  function handleFiles(files) {
    const selectedFiles = Array.from(files)
    if (!selectedFiles.length) return
    const time = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
    const fileMessages = selectedFiles.map((file, index) => {
      const isImage = file.type.startsWith('image/')
      const fileUrl = isImage ? URL.createObjectURL(file) : ''
      if (fileUrl) {
        fileUrlsRef.current.push(fileUrl)
      }
      return {
        id: makeId() + index,
        from: 'me',
        text: file.name,
        type: isImage ? 'image' : 'file',
        fileName: file.name,
        fileSize: file.size,
        fileUrl,
        time,
        read: false,
        reactions: [],
        replyTo: replyTo ? { author: replyTo.author ?? 'You', text: replyTo.text } : null,
      }
    })
    setChats((items) =>
      items.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              attachments: [...chat.attachments, ...selectedFiles.map((file) => file.name)],
              preview: selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} files`,
              time,
              messages: [...chat.messages, ...fileMessages],
            }
          : chat,
      ),
    )
    setReplyTo(null)
    notify(`${selectedFiles.length} file attached`)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function startCall(kind) {
    setCallState({ kind })
    notify(`${kind === 'video' ? 'Video' : 'Voice'} call started`)
  }

  function endCall() {
    setCallState(null)
    notify('Call finished')
  }

  function addReaction(messageId, reaction) {
    setChats((items) =>
      items.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: chat.messages.map((item) =>
                item.id === messageId ? { ...item, reactions: [...new Set([...item.reactions, reaction])] } : item,
              ),
            }
          : chat,
      ),
    )
  }

  function sendMessage() {
    const text = message.trim()
    if (!text) return
    const time = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
    if (editingMessageId) {
      setChats((items) =>
        items.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                preview: text,
                time,
                messages: chat.messages.map((item) =>
                  item.id === editingMessageId ? { ...item, text, edited: true, time } : item,
                ),
              }
            : chat,
        ),
      )
      setEditingMessageId(null)
      setMessage('')
      if (messageInputRef.current) {
        messageInputRef.current.style.height = '38px'
      }
      messageInputRef.current?.focus()
      notify('Message edited')
      return
    }

    setChats((items) =>
      items.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              preview: text,
              time,
              messages: [
                ...chat.messages,
                {
                  id: makeId(),
                  from: 'me',
                  text,
                  time,
                  read: false,
                  reactions: [],
                  replyTo: replyTo ? { author: replyTo.author ?? 'You', text: replyTo.text } : null,
                },
              ],
            }
          : chat,
      ),
    )
    setMessage('')
    setReplyTo(null)
    if (messageInputRef.current) {
      messageInputRef.current.style.height = '38px'
    }
    messageInputRef.current?.focus()
    notify('Message sent')
  }

  function sendVoiceMessage(audioUrl, targetChatId = activeChat.id) {
    const time = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
    setChats((items) =>
      items.map((chat) =>
        chat.id === targetChatId
          ? {
              ...chat,
              preview: 'Voice message',
              time,
              messages: [
                ...chat.messages,
                {
                  id: makeId(),
                  from: 'me',
                  text: 'Voice message',
                  type: 'voice',
                  audioUrl,
                  time,
                  read: false,
                  reactions: [],
                },
              ],
            }
          : chat,
      ),
    )
  }

  async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      notify('Voice recording is not supported')
      return
    }

    try {
      const targetChatId = activeChat.id
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      voiceChunksRef.current = []
      voiceStreamRef.current = stream
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(voiceChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const audioUrl = URL.createObjectURL(blob)
        voiceUrlsRef.current.push(audioUrl)
        voiceStreamRef.current?.getTracks().forEach((track) => track.stop())
        voiceStreamRef.current = null
        recorderRef.current = null
        voiceChunksRef.current = []
        setRecording(false)
        sendVoiceMessage(audioUrl, targetChatId)
        notify('Voice message sent')
      }

      recorder.start()
      setRecording(true)
      notify('Recording voice...')
    } catch {
      setRecording(false)
      notify('Microphone access denied')
    }
  }

  function stopVoiceRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
  }

  function handleVoiceButton() {
    if (message.trim()) {
      sendMessage()
      return
    }
    if (recording) {
      stopVoiceRecording()
      return
    }
    startVoiceRecording()
  }

  function startReply(item) {
    setReplyTo(item)
    messageInputRef.current?.focus()
  }

  function startEdit(item) {
    setEditingMessageId(item.id)
    setReplyTo(null)
    setMessage(item.text)
    window.setTimeout(() => {
      if (messageInputRef.current) {
        resizeMessageInput(messageInputRef.current)
        messageInputRef.current.focus()
      }
    }, 0)
  }

  function cancelComposerMode() {
    setEditingMessageId(null)
    setReplyTo(null)
    setMessage('')
    if (messageInputRef.current) {
      messageInputRef.current.style.height = '38px'
      messageInputRef.current.focus()
    }
  }

  function deleteMessage(messageId) {
    const messageToDelete = activeChat.messages.find((item) => item.id === messageId)
    if (messageToDelete?.audioUrl) {
      URL.revokeObjectURL(messageToDelete.audioUrl)
      voiceUrlsRef.current = voiceUrlsRef.current.filter((url) => url !== messageToDelete.audioUrl)
    }
    if (messageToDelete?.fileUrl) {
      URL.revokeObjectURL(messageToDelete.fileUrl)
      fileUrlsRef.current = fileUrlsRef.current.filter((url) => url !== messageToDelete.fileUrl)
    }
    setChats((items) =>
      items.map((chat) =>
        {
          if (chat.id !== activeChat.id) return chat

          const nextMessages = chat.messages.filter((item) => item.id !== messageId)
          const latestMessage = nextMessages.at(-1)
          const shouldReduceUnread = messageToDelete?.from === 'them' && chat.unread > 0

          return {
            ...chat,
            attachments: messageToDelete?.fileName
              ? chat.attachments.filter((file) => file !== messageToDelete.fileName)
              : chat.attachments,
            preview: getMessagePreview(latestMessage),
            time: latestMessage?.time ?? '',
            unread: shouldReduceUnread ? chat.unread - 1 : chat.unread,
            messages: nextMessages,
          }
        },
      ),
    )
    if (editingMessageId === messageId) {
      setEditingMessageId(null)
      setMessage('')
    }
    if (replyTo?.id === messageId) {
      setReplyTo(null)
    }
    notify('Message deleted')
  }

  function pinMessage(messageId) {
    setChats((items) =>
      items.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: chat.messages.map((item) => ({ ...item, pinned: item.id === messageId ? !item.pinned : false })),
            }
          : chat,
      ),
    )
    notify('Pinned message updated')
  }

  function resizeMessageInput(element) {
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 96)}px`
  }

  function handleMessageChange(event) {
    setMessage(event.target.value)
    resizeMessageInput(event.target)
  }

  function focusMessageInput() {
    setKeyboardOpen(true)
    window.setTimeout(() => messageInputRef.current?.focus(), 0)
  }

  function updateMessageFromKeyboard(updater) {
    setMessage((current) => {
      const next = updater(current)
      window.setTimeout(() => {
        if (messageInputRef.current) {
          resizeMessageInput(messageInputRef.current)
          messageInputRef.current.focus()
        }
      }, 0)
      return next
    })
  }

  function pressKeyboardKey(key) {
    if (key === 'backspace') {
      updateMessageFromKeyboard((current) => current.slice(0, -1))
      return
    }
    if (key === 'space') {
      updateMessageFromKeyboard((current) => `${current} `)
      return
    }
    if (key === 'enter') {
      sendMessage()
      return
    }
    updateMessageFromKeyboard((current) => `${current}${key.toLowerCase()}`)
  }

  function startLanguageHold() {
    window.clearTimeout(languageHoldTimer.current)
    languageLongPressedRef.current = false
    languageHoldTimer.current = window.setTimeout(() => {
      languageLongPressedRef.current = true
      setLanguageMenuOpen(true)
      notify('Choose keyboard language')
    }, 3000)
  }

  function stopLanguageHold() {
    window.clearTimeout(languageHoldTimer.current)
  }

  function chooseKeyboardLanguage(language) {
    setKeyboardLanguage(language)
    setLanguageMenuOpen(false)
    messageInputRef.current?.focus()
    notify(`Keyboard: ${keyboardLayouts[language].label}`)
  }

  function handleSpaceKeyClick() {
    if (languageLongPressedRef.current) {
      languageLongPressedRef.current = false
      return
    }
    pressKeyboardKey('space')
  }

  function addEmoji(emoji) {
    setMessage((current) => `${current}${emoji}`)
    setEmojiOpen(false)
    window.setTimeout(() => messageInputRef.current?.focus(), 0)
  }

  function sendEmoji(emoji) {
    const time = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
    setChats((items) =>
      items.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              preview: emoji,
              time,
              messages: [...chat.messages, { id: makeId(), from: 'me', text: emoji, time, read: false, reactions: [] }],
            }
          : chat,
      ),
    )
    setEmojiOpen(false)
    messageInputRef.current?.focus()
    notify('Emoji sent')
  }

  function requestNotifications() {
    if (!('Notification' in window)) {
      notify('Browser notifications are not supported')
      return
    }
    Notification.requestPermission().then((permission) => {
      setSettings((current) => ({ ...current, notifications: permission === 'granted' }))
      notify(`Notifications: ${permission}`)
    })
  }

  function updateSettings(nextSettings) {
    setSettings((current) => ({ ...current, ...nextSettings }))
  }

  return (
    <main
      className={`app-shell ${theme} ${keyboardOpen ? 'keyboard-open' : ''}`}
      style={{ '--primary': settings.accent, '--message-font': `${settings.fontSize}px` }}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
    >
      <aside className="rail" aria-label="Main navigation">
        <button className="avatar-button" onClick={() => setPanel('profile')} aria-label="Open profile">
          BK
        </button>

        <nav className="rail-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeNav === item.id ? 'active' : ''}
              onClick={() => setActiveNav(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <Icon name={item.icon} />
            </button>
          ))}
        </nav>

        <div className="rail-bottom">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Theme" aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <button onClick={() => setPanel('settings')} title="Settings" aria-label="Open settings">
            <Icon name="settings" />
          </button>
          <button onClick={() => notify('Session finished')} title="Logout" aria-label="Logout">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <section className={`chat-list ${mobileListOpen ? 'open' : ''}`}>
        <header className="list-header">
          <div>
            <p className="eyebrow">Telegram Ultra</p>
            <h1>Messages</h1>
          </div>
          <div className="list-actions">
            <button className="icon-button" onClick={() => setNewChatOpen(true)} aria-label="Create chat">
              <Icon name="plus" />
            </button>
            <button className="icon-button" onClick={() => setPanel('archive')} aria-label="Open archive">
              <Icon name="archive" />
            </button>
            <button className="icon-button mobile-close" onClick={() => setMobileListOpen(false)} aria-label="Close chat list">
              <Icon name="close" />
            </button>
          </div>
        </header>

        <div className="search-box">
          <Icon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users, files, messages" />
        </div>

        <div className="segmented" aria-label="Sort chats">
          {['priority', 'unread', 'name'].map((item) => (
            <button key={item} className={sort === item ? 'active' : ''} onClick={() => setSort(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="stats-row">
          <span>{totals.unread} unread</span>
          <span>{totals.online} online</span>
          <span>{totals.pinned} pinned</span>
        </div>

        <div className="chat-scroll">
          {filteredChats.map((chat) => (
            <article key={chat.id} className={`chat-card ${activeChat.id === chat.id ? 'active' : ''}`} onClick={() => selectChat(chat.id)}>
              <div className="avatar" style={{ '--avatar': chat.accent }}>
                {chat.avatar}
                {chat.online && <span className="online-dot" />}
              </div>
              <div className="chat-copy">
                <div className="chat-title">
                  <strong>{chat.name}</strong>
                  <span>{chat.time}</span>
                </div>
                <p>{chat.preview}</p>
                <div className="chat-meta">
                  {chat.pinned && <span><Icon name="pin" /> pinned</span>}
                  {chat.muted && <span><Icon name="mute" /> muted</span>}
                </div>
              </div>
              {chat.unread > 0 && <b className="unread">{chat.unread}</b>}
              <div className="chat-actions">
                <button onClick={(event) => { event.stopPropagation(); togglePin(chat.id) }} aria-label="Pin chat">
                  <Icon name="pin" />
                </button>
                <button onClick={(event) => { event.stopPropagation(); toggleMute(chat.id) }} aria-label="Mute chat">
                  <Icon name="mute" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {mobileListOpen && <button className="mobile-backdrop" onClick={() => setMobileListOpen(false)} aria-label="Close chat list overlay" />}

      <section className="conversation">
        <header className="chat-header">
          <button className="mobile-menu" onClick={() => setMobileListOpen(true)} aria-label="Open chat list">
            <Icon name="back" />
          </button>
          <button className="contact-trigger" onClick={() => setContactOpen(true)} aria-label="Open contact profile">
            <div className="avatar small" style={{ '--avatar': activeChat.accent }}>
              {activeChat.avatar}
            </div>
            <div className="header-copy">
              <h2>{activeChat.name}</h2>
              <p>{activeChat.status}</p>
            </div>
          </button>
          <div className="header-actions">
            <button onClick={() => setPanel('search')} aria-label="Search in chat"><Icon name="search" /></button>
            <button onClick={() => startCall('voice')} aria-label="Start call"><Icon name="call" /></button>
            <button onClick={() => startCall('video')} aria-label="Start video call"><Icon name="video" /></button>
            <button onClick={() => setPanel('details')} aria-label="More"><Icon name="more" /></button>
          </div>
        </header>

        <div className="pinned-bar">
          <Icon name="pin" />
          <span>{pinnedMessage ? pinnedMessage.text : 'No pinned messages'}</span>
        </div>

        {panel === 'search' && (
          <div className="chat-search-strip">
            <Icon name="search" />
            <input
              value={chatSearch}
              onChange={(event) => setChatSearch(event.target.value)}
              placeholder="Search in this chat"
            />
            <button onClick={() => { setChatSearch(''); setPanel('settings') }} aria-label="Close chat search">
              <Icon name="close" />
            </button>
          </div>
        )}

        <div className="messages">
          <div className="message-stack">
            {visibleMessages.map((item) => (
              <div
                key={item.id}
                className={`message-row ${item.from === 'me' ? 'outgoing' : 'incoming'} ${chatSearch ? 'searched' : ''}`}
              >
                <div className="bubble">
                  {item.author && <strong>{item.author}</strong>}
                  {item.replyTo && (
                    <div className="reply-preview">
                      <b>{item.replyTo.author}</b>
                      <span>{item.replyTo.text}</span>
                    </div>
                  )}
                  {item.type === 'voice' ? (
                    <div className="voice-message">
                      <span className="voice-wave">▂▄▆█▆▄▂</span>
                      <audio src={item.audioUrl} controls />
                    </div>
                  ) : item.type === 'image' ? (
                    <div className="image-message">
                      {item.fileUrl ? <img src={item.fileUrl} alt={item.fileName} /> : <div className="file-placeholder">Preview expired</div>}
                      <p>{item.fileName}</p>
                    </div>
                  ) : item.type === 'file' ? (
                    <div className="file-message">
                      <span><Icon name="file" /></span>
                      <div>
                        <b>{item.fileName}</b>
                        <small>{Math.max(1, Math.round((item.fileSize ?? 0) / 1024))} KB</small>
                      </div>
                    </div>
                  ) : (
                    <p>{item.text}</p>
                  )}
                  <div className="message-footer">
                    <span>{item.time}</span>
                    {item.edited && <span>edited</span>}
                    {item.from === 'me' && <span className="ticks">{item.read ? '✓✓' : '✓'}</span>}
                  </div>
                  <div className="reactions">
                    {item.reactions.map((reaction) => (
                      <span key={reaction}>{reaction}</span>
                    ))}
                    <button onClick={() => addReaction(item.id, 'like')}>+</button>
                  </div>
                  <div className="message-actions">
                    <button onClick={() => startReply(item)} aria-label="Reply">
                      <Icon name="reply" />
                    </button>
                    {item.from === 'me' && (
                      <button onClick={() => startEdit(item)} aria-label="Edit">
                        <Icon name="edit" />
                      </button>
                    )}
                    <button onClick={() => pinMessage(item.id)} aria-label="Pin">
                      <Icon name="pin" />
                    </button>
                    <button onClick={() => deleteMessage(item.id)} aria-label="Delete">
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="messages-end" />
          </div>
        </div>

        <footer className="composer">
          {(replyTo || editingMessageId) && (
            <div className="composer-context">
              <div>
                <b>{editingMessageId ? 'Editing message' : `Reply to ${replyTo.author ?? 'message'}`}</b>
                <span>{editingMessageId ? message : replyTo.text}</span>
              </div>
              <button onClick={cancelComposerMode} aria-label="Cancel">
                <Icon name="close" />
              </button>
            </div>
          )}
          <button className="emoji-toggle" aria-label="Open emoji" onClick={() => setEmojiOpen((open) => !open)}>
            <Icon name="emoji" />
          </button>
          <textarea
            ref={messageInputRef}
            value={message}
            onFocus={focusMessageInput}
            onChange={handleMessageChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Message"
            rows="1"
          />
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            multiple
            onChange={(event) => {
              handleFiles(event.target.files)
              event.target.value = ''
            }}
          />
          <button aria-label="Attach file" onClick={openFilePicker}>
            <Icon name="attach" />
          </button>
          <button
            className={`send-button ${recording ? 'recording' : ''}`}
            onClick={handleVoiceButton}
            aria-label={message.trim() ? 'Send message' : 'Record voice'}
          >
            <Icon name={message.trim() ? 'send' : 'mic'} />
          </button>
          {emojiOpen && (
            <div className="emoji-panel" aria-label="Emoji picker">
              {emojiSet.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  onDoubleClick={() => sendEmoji(emoji)}
                  aria-label={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              <button className="emoji-send" onClick={() => sendEmoji('👍')} aria-label="Send like emoji">
                Send 👍
              </button>
            </div>
          )}
        </footer>

        {keyboardOpen && (
          <div
            className="mobile-keyboard"
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Mobile keyboard"
          >
            <div className="keyboard-toolbar">
              <button onClick={() => pressKeyboardKey('space')} aria-label="Keyboard menu">▦</button>
              <button onClick={() => setEmojiOpen((open) => !open)}>☺</button>
              <button>GIF</button>
              <button>⚙</button>
              <button className="keyboard-hide" onClick={() => setKeyboardOpen(false)}>⌄</button>
            </div>
            {currentKeyboard.rows.map((row) => (
              <div className="keyboard-row" key={row.join('')}>
                {row.map((key) => (
                  <button key={key} onClick={() => pressKeyboardKey(key)}>
                    {key}
                  </button>
                ))}
              </div>
            ))}
            <div className="keyboard-row keyboard-bottom-row">
              <button className="keyboard-action">?123</button>
              <button onClick={() => pressKeyboardKey(',')}>,</button>
              <button
                onClick={handleSpaceKeyClick}
                onPointerDown={startLanguageHold}
                onPointerUp={stopLanguageHold}
                onPointerLeave={stopLanguageHold}
                onPointerCancel={stopLanguageHold}
                className="keyboard-space"
              >
                {currentKeyboard.label}
              </button>
              <button onClick={() => pressKeyboardKey('.')}>.</button>
              <button onClick={() => pressKeyboardKey('backspace')} className="keyboard-action">⌫</button>
              <button onClick={() => pressKeyboardKey('enter')} className="keyboard-enter">↩</button>
            </div>
            {languageMenuOpen && (
              <div className="keyboard-language-menu">
                {Object.entries(keyboardLayouts).map(([language, layout]) => (
                  <button
                    key={language}
                    className={keyboardLanguage === language ? 'active' : ''}
                    onClick={() => chooseKeyboardLanguage(language)}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {dragging && <div className="drop-layer">Drop files here to send</div>}
      </section>

      <aside className="inspector">
        <div className="panel-card profile-card">
          <div className="avatar large" style={{ '--avatar': activeChat.accent }}>
            {activeChat.avatar}
          </div>
          <h2>{panel === 'profile' ? 'Bakyt Ultra' : activeChat.name}</h2>
          <p>{panel === 'profile' ? '@bakyy' : activeChat.status}</p>
          <div className="profile-actions">
            <button onClick={requestNotifications}>Enable push</button>
            <button onClick={() => archiveChat(activeChat.id)}>Archive</button>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title">
            <h3>{panel}</h3>
            <button onClick={() => setPanel('settings')} aria-label="Settings"><Icon name="settings" /></button>
          </div>
          <div className="settings-grid">
            <label>
              Theme
              <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Accent
              <input
                type="color"
                value={settings.accent}
                onChange={(event) => updateSettings({ accent: event.target.value })}
              />
            </label>
            <label>
              Font
              <input
                type="range"
                min="14"
                max="19"
                value={settings.fontSize}
                onChange={(event) => updateSettings({ fontSize: Number(event.target.value) })}
              />
            </label>
            <label>
              Privacy
              <input
                type="checkbox"
                checked={settings.privacy}
                onChange={(event) => updateSettings({ privacy: event.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="panel-card">
          <h3>Files</h3>
          <ul className="file-list">
            {activeChat.attachments.map((file) => (
              <li key={file}>
                <span>{file.split('.').pop()}</span>
                {file}
              </li>
            ))}
          </ul>
        </div>

        <div className="feature-grid">
          {featureCards.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </aside>

      {newChatOpen && (
        <div className="modal-backdrop" onClick={() => setNewChatOpen(false)}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()} aria-label="Create new chat">
            <div className="modal-title">
              <h2>New chat</h2>
              <button onClick={() => setNewChatOpen(false)} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            <input
              className="modal-input"
              value={newChatName}
              onChange={(event) => setNewChatName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') createChat('personal')
              }}
              placeholder="Contact, group or channel name"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => createChat('personal')}>Contact</button>
              <button onClick={() => createChat('groups')}>Group</button>
              <button onClick={() => createChat('channels')}>Channel</button>
            </div>
          </section>
        </div>
      )}

      {contactOpen && (
        <div className="modal-backdrop" onClick={() => setContactOpen(false)}>
          <section className="modal-card contact-card" onClick={(event) => event.stopPropagation()} aria-label="Contact profile">
            <div className="modal-title">
              <h2>Profile</h2>
              <button onClick={() => setContactOpen(false)} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            <div className="avatar large" style={{ '--avatar': activeChat.accent }}>
              {activeChat.avatar}
            </div>
            <h2>{settings.privacy ? activeChat.name : `${activeChat.name} @ultra`}</h2>
            <p>{activeChat.status}</p>
            <div className="contact-stats">
              <span>{activeChat.messages.length} messages</span>
              <span>{activeChat.attachments.length} files</span>
              <span>{activeChat.pinned ? 'pinned' : 'not pinned'}</span>
            </div>
            <div className="modal-actions">
              <button onClick={() => startCall('voice')}>Call</button>
              <button onClick={() => startCall('video')}>Video</button>
              <button onClick={() => toggleMute(activeChat.id)}>{activeChat.muted ? 'Unmute' : 'Mute'}</button>
            </div>
          </section>
        </div>
      )}

      {callState && (
        <div className="call-screen" aria-label="Active call">
          <div className="call-card">
            <div className="avatar large" style={{ '--avatar': activeChat.accent }}>
              {activeChat.avatar}
            </div>
            <p>{callState.kind === 'video' ? 'Video call' : 'Voice call'}</p>
            <h2>{activeChat.name}</h2>
            <span>connecting...</span>
            <div className="call-actions">
              <button onClick={() => notify('Microphone toggled')} aria-label="Toggle microphone">
                <Icon name="mic" />
              </button>
              <button onClick={() => notify('Camera toggled')} aria-label="Toggle camera">
                <Icon name="video" />
              </button>
              <button className="call-end" onClick={endCall} aria-label="End call">
                <Icon name="call" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toast" role="status">{toast}</div>
    </main>
  )
}

export default App
