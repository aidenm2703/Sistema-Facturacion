import { useRef, useState } from 'react'
import Icon from './Icon'

const CONTACTS = [
  {
    id: 'soporte',
    area: 'Soporte técnico',
    telefono: '+506 2280-1020',
    correo: 'soporte@aidensystem.cr',
    horario: 'Lun a Vie · 8:00 a 18:00',
    desc: 'Problemas con facturas, inventario o inicio de sesión.',
  },
  {
    id: 'atencion',
    area: 'Atención al cliente',
    telefono: '+506 2280-1030',
    correo: 'atencion@aidensystem.cr',
    horario: 'Todos los días · 7:00 a 20:00',
    desc: 'Dudas sobre reservas, pagos o uso general del sistema.',
  },
  {
    id: 'ventas',
    area: 'Ventas y planes',
    telefono: '+506 2280-1040',
    correo: 'ventas@aidensystem.cr',
    horario: 'Lun a Vie · 9:00 a 17:00',
    desc: 'Información sobre planes para nuevos negocios.',
  },
  {
    id: 'facturacion',
    area: 'Departamento de facturación',
    telefono: '+506 2280-1050',
    correo: 'contable@aidensystem.cr',
    horario: 'Lun a Vie · 9:00 a 16:00',
    desc: 'Consultas sobre impuestos, IVA y datos fiscales (RUC).',
  },
]

const botRules = [
  { keys: ['hola', 'buenas', 'saludos', 'hi', 'hey'], reply: '¡Hola! Soy Aiden, tu asistente virtual. ¿En qué puedo ayudarte hoy?' },
  { keys: ['factura', 'facturar', 'crear'], reply: 'Para crear una factura ve al menú y pulsa "Crear factura". Llena los datos del cliente, agrega productos del inventario y guarda. El total se calcula solo con el IVA.' },
  { keys: ['pago', 'cobrar', 'pagar', 'cobro'], reply: 'En la sección "Pagos" ves cuánto falta por cobrar. Usa "Registrar pago" para marcar una factura como pagada; vencidas y pendientes se muestran por separado.' },
  { keys: ['reserva', 'reservar', 'mesa', 'cita'], reply: 'En "Reservas" puedes agendar para varias personas. Puedes activar o no una señal por adelantado y simular la llamada al cliente. El calendario muestra todo junto.' },
  { keys: ['inventario', 'producto', 'stock', 'items'], reply: 'En "Inventario" ves precios y existencias en colones. Si eres administrador puedes editar, agregar o eliminar productos; al facturar se descuenta el stock automáticamente.' },
  { keys: ['usuario', 'empleado', 'permiso', 'acceso', 'rol'], reply: 'El administrador gestiona empleados y permisos en la sección "Usuarios": puede decidir quién factura, cobra, ve inventario, reservas o el panel administrativo.' },
  { keys: ['quien', 'quiénes', 'somos', 'about', 'acerca'], reply: 'Somos Aiden\'s System: una solución de facturación en colones para negocios costarricenses. Para más detalle visita la sección "¿Quiénes somos?".' },
  { keys: ['ayuda', 'contacto', 'telefono', 'teléfono', 'correo', 'email', 'soporte'], reply: 'Puedes contactarnos por teléfono o correo en la parte de Contacto de esta página. ¡Simula una llamada o un correo con los botones!' },
  { keys: ['venci', 'atrasada', 'estado'], reply: 'Cada factura tiene vencimiento. El estado (Pagada, Pendiente o Vencida) se deriva solo, y puedes marcarla pagada manualmente desde "Pagos".' },
  { keys: ['gracias', 'feliz', 'genial'], reply: '¡Con gusto! Siempre que necesites ayuda, aquí estoy.' },
]

function botReply(input) {
  const texto = input.toLowerCase()
  const match = botRules.find((r) => r.keys.some((k) => texto.includes(k)))
  return match
    ? match.reply
    : 'Entiendo tu mensaje. Puedo ayudarte con facturas, pagos, reservas, inventario, usuarios y más. Prueba con "¿Cómo creo una factura?" o revisa los accesos rápidos.'
}

const SUGGESTIONS = [
  '¿Cómo creo una factura?',
  '¿Cómo registro un pago?',
  'Gestionar reservas',
  '¿Qué es el inventario?',
  'Contactar soporte',
]

function HelpScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      autor: 'bot',
      texto: '¡Hola! Soy Aiden, tu asistente virtual de asistencia en tiempo real. Pregúntame lo que necesites.',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [calling, setCalling] = useState(null)
  const [sentMail, setSentMail] = useState(null)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 50)
  }

  const send = (raw) => {
    const texto = (raw ?? input).trim()
    if (!texto || typing) return
    setMessages((m) => [...m, { id: Date.now(), autor: 'user', texto }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, autor: 'bot', texto: botReply(texto) },
      ])
      setTyping(false)
      scrollToBottom()
    }, 1100)
    scrollToBottom()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  const simulateCall = (c) => {
    if (calling) return
    setCalling(c)
    setTimeout(() => setCalling(null), 4000)
  }

  const simulateMail = (c) => {
    setSentMail(c)
    setTimeout(() => setSentMail(null), 3200)
  }

  return (
    <div className="help-screen">
      <div className="section-head">
        <div>
          <h2>Centro de ayuda</h2>
          <p className="subtitle">
            Contacta con nuestro equipo o escribe al asistente virtual para recibir
            ayuda en tiempo real.
          </p>
        </div>
      </div>

      <div className="help-layout">
        <div className="help-contact-col">
          <h3>Contacto</h3>
          <p className="help-intro">
            Elige un departamento para <strong>simular una llamada</strong> o el{' '}
            <strong>envío de un correo</strong> de consulta.
          </p>

          <div className="contact-list">
            {CONTACTS.map((c) => (
              <div key={c.id} className="contact-card">
                <div className="contact-head">
                  <span className="contact-id">
                    <Icon name="phone" size={18} />
                  </span>
                  <div>
                    <strong>{c.area}</strong>
                    <small>{c.desc}</small>
                  </div>
                </div>
                <div className="contact-lines">
                  <span>
                    <Icon name="phone" size={14} /> {c.telefono}
                  </span>
                  <span>
                    <Icon name="mail" size={14} /> {c.correo}
                  </span>
                  <span className="contact-horario">{c.horario}</span>
                </div>
                <div className="contact-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => simulateCall(c)}
                    disabled={!!calling}
                  >
                    <Icon name="phone" size={14} />
                    {calling?.id === c.id ? 'Llamando...' : 'Llamar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost-small"
                    onClick={() => simulateMail(c)}
                    disabled={!!sentMail}
                  >
                    <Icon name="mail" size={14} /> Enviar correo
                  </button>
                </div>
                {calling?.id === c.id && (
                  <div className="help-call-feedback">
                    <div className="call-phone-icon">
                      <Icon name="phone" size={20} />
                    </div>
                    Llamando a {c.area} ({c.telefono})...
                  </div>
                )}
                {sentMail?.id === c.id && (
                  <div className="help-mail-feedback">
                    <Icon name="check" size={16} />
                    Correo enviado a {c.correo}. Te responderemos pronto.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-col">
          <div className="chat-panel">
            <div className="chat-head">
              <span className="chat-avatar">A</span>
              <div>
                <strong>Asistente virtual</strong>
                <span className="chat-status">
                  <span className="chat-dot" /> En línea · responde en tiempo real
                </span>
              </div>
            </div>

            <div className="chat-body">
              {messages.map((m) => (
                <div key={m.id} className={`chat-msg ${m.autor}`}>
                  {m.texto}
                </div>
              ))}
              {typing && (
                <div className="chat-msg bot typing-msg">
                  <span className="typing-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chat-chip"
                  onClick={() => send(s)}
                  disabled={typing}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                type="text"
                value={input}
                placeholder="Escribe tu consulta..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={typing}
              />
              <button
                type="button"
                className="btn btn-primary chat-send"
                onClick={() => send()}
                disabled={typing || !input.trim()}
                title="Enviar"
              >
                <Icon name="send" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpScreen