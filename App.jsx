import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  navy:    "#0a1628",
  blue:    "#1a4fa8",
  sky:     "#2e8bff",
  accent:  "#00c896",
  warm:    "#f8f7f4",
  card:    "#ffffff",
  border:  "#e8e4dc",
  muted:   "#7a8399",
  danger:  "#e84040",
  gold:    "#f5a623",
};

/* ─── DATA ─── */
const LISTINGS = [
  {
    id: 1, title: "Luxury 3-Bed Condo", location: "GRA, Ikeja, Lagos",
    price: "₦85,000,000", type: "Sale", beds: 3, baths: 2, sqft: 1800,
    agent: "Emeka Obi", agentId: "a1", agentImg: "EO", verified: true,
    tags: ["360° Tour", "Serviced"], views: 324, inquiries: 18,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    desc: "Stunning 3-bedroom condo in the heart of GRA Ikeja. Fully serviced with 24/7 power, water and security. Spacious living areas with premium finishes throughout. Perfect for families or as an investment property.",
  },
  {
    id: 2, title: "Beachfront 5-Bed Villa", location: "Lekki Phase 1, Lagos",
    price: "₦250,000,000", type: "Sale", beds: 5, baths: 4, sqft: 4500,
    agent: "Ngozi Adeyemi", agentId: "a2", agentImg: "NA", verified: true,
    tags: ["Premium", "Beachfront"], views: 891, inquiries: 42,
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    desc: "Breathtaking beachfront villa with direct ocean access. Private pool, smart home automation, and panoramic sea views. A rare opportunity to own a piece of paradise in Lagos' most prestigious address.",
  },
  {
    id: 3, title: "Modern 2-Bed Flat", location: "Victoria Island, Lagos",
    price: "₦4,500,000/yr", type: "Rent", beds: 2, baths: 2, sqft: 1100,
    agent: "Emeka Obi", agentId: "a1", agentImg: "EO", verified: true,
    tags: ["Available Now", "Furnished"], views: 210, inquiries: 9,
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    desc: "Contemporary flat in prime VI. Walking distance to major offices and restaurants. Fully furnished with air conditioning, inverter power, and a secure car park. Ideal for young professionals.",
  },
  {
    id: 4, title: "Office Space", location: "Yaba, Lagos",
    price: "₦12,000,000/yr", type: "Lease", beds: 0, baths: 3, sqft: 3200,
    agent: "Tunde Bakare", agentId: "a3", agentImg: "TB", verified: true,
    tags: ["Commercial", "Open Plan"], views: 143, inquiries: 5,
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    desc: "Open-plan office space in the heart of Lagos' tech hub. Fiber internet, backup power, shared meeting rooms, and a reception area. Perfect for startups and growing companies.",
  },
  {
    id: 5, title: "4-Bed Duplex", location: "Ajah, Lagos",
    price: "₦55,000,000", type: "Sale", beds: 4, baths: 3, sqft: 2800,
    agent: "Ngozi Adeyemi", agentId: "a2", agentImg: "NA", verified: true,
    tags: ["New Build", "360° Tour"], views: 187, inquiries: 11,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    desc: "Brand new duplex in the fast-growing Ajah axis. Good road access, neighbourhood security, and modern finishes. Excellent investment potential with proximity to Lekki-Epe expressway.",
  },
  {
    id: 6, title: "Studio Apartment", location: "Surulere, Lagos",
    price: "₦800,000/yr", type: "Rent", beds: 1, baths: 1, sqft: 450,
    agent: "Tunde Bakare", agentId: "a3", agentImg: "TB", verified: true,
    tags: ["Budget Friendly", "Self Contain"], views: 97, inquiries: 6,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    desc: "Compact and well-maintained studio apartment with a tiled floor, functional kitchen, and clean bathroom. Secure compound with parking. Ideal for students or single professionals in Lagos.",
  },
];

const AGENTS = {
  a1: { name: "Emeka Obi", company: "Obi Realty", phone: "+234 803 000 0001", initials: "EO", listings: 12, deals: 84, bio: "10+ years in Lagos real estate. Specialist in GRA and Ikoyi." },
  a2: { name: "Ngozi Adeyemi", company: "LagosLux Properties", phone: "+234 806 111 2222", initials: "NA", listings: 9, deals: 67, bio: "Expert in high-end Lekki and Ajah markets." },
  a3: { name: "Tunde Bakare", company: "Prime Space NG", phone: "+234 812 222 3333", initials: "TB", listings: 7, deals: 43, bio: "Commercial and residential specialist, Yaba & Surulere." },
};

/* ─── HELPERS ─── */
const css = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');

function Avatar({ initials, size = 40, color = T.blue }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${T.sky})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.32, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, type = "default" }) {
  const colors = {
    default: { bg: "#e8f0fb", c: T.blue },
    green:   { bg: "#e6faf4", c: "#00a87a" },
    gold:    { bg: "#fef6e4", c: "#c87d00" },
    navy:    { bg: T.navy,   c: "#fff" },
  };
  const t = type === "Sale" ? "navy" : type === "Rent" ? "green" : type === "Lease" ? "gold" : "default";
  const s = colors[t] || colors.default;
  return (
    <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

function Btn({ children, variant = "primary", onClick, sx = {}, disabled = false }) {
  const base = {
    border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
    padding: "11px 20px", fontFamily: "inherit", transition: "all 0.18s", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.55 : 1,
  };
  const variants = {
    primary:  { background: `linear-gradient(135deg, ${T.blue}, ${T.sky})`, color: "#fff", boxShadow: "0 4px 16px rgba(26,79,168,0.28)" },
    ghost:    { background: "transparent", color: T.blue, border: `1.5px solid ${T.blue}` },
    accent:   { background: T.accent, color: "#fff", boxShadow: "0 4px 16px rgba(0,200,150,0.28)" },
    muted:    { background: T.border, color: T.navy },
    danger:   { background: T.danger, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sx }}>
      {children}
    </button>
  );
}

/* ─── INSPECTION MODAL ─── */
function InspectionModal({ listing, onClose }) {
  const [mode, setMode] = useState(""); // "virtual" | "physical"
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!date || !time || !name || !phone) return alert("Please fill all fields.");
    setDone(true);
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const overlay = { position: "fixed", inset: 0, background: "rgba(10,22,40,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)" };
  const box = { background: T.card, borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 28, position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" };

  if (done) return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...box, textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.navy, marginBottom: 8 }}>Inspection Scheduled!</h2>
        <p style={{ color: T.muted, marginBottom: 6 }}>
          <strong style={{ color: T.navy }}>{mode === "virtual" ? "Virtual" : "Physical"} Inspection</strong> for<br />
          <strong style={{ color: T.blue }}>{listing.title}</strong>
        </p>
        <div style={{ background: T.warm, borderRadius: 12, padding: "14px 18px", margin: "16px 0", textAlign: "left" }}>
          {[["📅 Date", date], ["⏰ Time", time], ["👤 Name", name], ["📞 Phone", phone]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ color: T.muted }}>{l}</span>
              <span style={{ fontWeight: 600, color: T.navy }}>{v}</span>
            </div>
          ))}
        </div>
        {mode === "virtual" && <p style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>📧 A Google Meet link will be sent to you before the session.</p>}
        <Btn onClick={onClose} sx={{ width: "100%", justifyContent: "center" }}>Done</Btn>
      </div>
    </div>
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: T.border, border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.navy, marginBottom: 4 }}>Schedule Inspection</h2>
        <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>{listing.title} · {listing.location}</p>

        {!mode ? (
          <div>
            <p style={{ fontWeight: 600, color: T.navy, marginBottom: 14 }}>Choose inspection type:</p>
            {[
              { k: "virtual", icon: "🎥", title: "Virtual Inspection", desc: "Live video tour via Google Meet. Free, instant, no travel needed." },
              { k: "physical", icon: "🏠", title: "Physical Inspection", desc: "In-person visit with the agent at the property." },
            ].map(opt => (
              <div key={opt.k} onClick={() => setMode(opt.k)}
                style={{ border: `2px solid ${T.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 12, cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", transition: "border-color 0.15s", background: T.warm }}>
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: T.navy, marginBottom: 3 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "8px 12px", background: T.warm, borderRadius: 10 }}>
              <span style={{ fontSize: 20 }}>{mode === "virtual" ? "🎥" : "🏠"}</span>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{mode === "virtual" ? "Virtual" : "Physical"} Inspection</span>
              <button onClick={() => setMode("")} style={{ marginLeft: "auto", background: "none", border: "none", color: T.blue, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Change</button>
            </div>

            <Field label="Your Full Name" req>
              <input placeholder="e.g. Adaeze Nwosu" value={name} onChange={e => setName(e.target.value)} style={inputSx} />
            </Field>
            <Field label="Phone Number" req>
              <input placeholder="+234 800 000 0000" value={phone} onChange={e => setPhone(e.target.value)} style={inputSx} />
            </Field>
            <Field label="Preferred Date" req>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={inputSx} />
            </Field>
            <Field label="Preferred Time" req>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {timeSlots.map(t => (
                  <button key={t} onClick={() => setTime(t)}
                    style={{ padding: "9px 4px", borderRadius: 8, border: `1.5px solid ${time === t ? T.blue : T.border}`, background: time === t ? "#e8f0fb" : T.warm, color: time === t ? T.blue : T.navy, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Btn onClick={submit} sx={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
              Confirm Inspection →
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

const inputSx = {
  width: "100%", padding: "11px 14px", border: `1.5px solid #e8e4dc`, borderRadius: 10,
  fontSize: 14, color: T.navy, background: T.warm, outline: "none", fontFamily: "inherit",
};

function Field({ label, req, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.navy, display: "block", marginBottom: 6, letterSpacing: 0.3 }}>
        {label}{req && <span style={{ color: T.danger }}> *</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── MESSAGE MODAL ─── */
function MessageModal({ listing, onClose }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [chat, setChat] = useState([
    { from: "agent", text: `Hi! Thanks for your interest in ${listing.title}. How can I help you?`, time: "just now" },
  ]);
  const [input, setInput] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, time: "just now" };
    const replies = [
      "Thanks for reaching out! I'll get back to you shortly.",
      "Great question! This property is still available. Would you like to schedule an inspection?",
      "Sure! The property is in excellent condition. Feel free to ask anything.",
      "I can arrange a virtual tour at your convenience. What time works for you?",
    ];
    const agentReply = { from: "agent", text: replies[Math.floor(Math.random() * replies.length)], time: "just now" };
    setChat(c => [...c, userMsg]);
    setInput("");
    setTimeout(() => setChat(c => [...c, agentReply]), 1200);
  };

  const overlay = { position: "fixed", inset: 0, background: "rgba(10,22,40,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)" };
  const box = { background: T.card, borderRadius: 20, width: "100%", maxWidth: 480, height: 540, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", overflow: "hidden" };

  const agent = AGENTS[listing.agentId];

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ background: T.navy, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials={agent.initials} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{agent.name}</div>
            <div style={{ color: T.sky, fontSize: 11 }}>🟢 Online · {agent.company}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Property context */}
        <div style={{ background: T.warm, padding: "10px 20px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>
          💬 Re: <span style={{ color: T.blue, fontWeight: 600 }}>{listing.title}</span> — {listing.location}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "76%", background: m.from === "user" ? `linear-gradient(135deg,${T.blue},${T.sky})` : T.warm,
                color: m.from === "user" ? "#fff" : T.navy, borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                padding: "10px 14px", fontSize: 13, lineHeight: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
                {m.text}
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={ref} />
        </div>

        {/* Quick replies */}
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 6, overflowX: "auto" }}>
          {["Is this still available?", "Schedule inspection", "Share more photos"].map(q => (
            <button key={q} onClick={() => { setInput(q); }} style={{ background: T.warm, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T.navy, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 16px 16px", display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message…"
            style={{ flex: 1, padding: "11px 16px", border: `1.5px solid ${T.border}`, borderRadius: 24, fontSize: 13, outline: "none", fontFamily: "inherit", background: T.warm }} />
          <button onClick={send} style={{ background: `linear-gradient(135deg,${T.blue},${T.sky})`, border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ─── LISTING DETAIL ─── */
function ListingDetail({ listing, onBack, onInspect, onMessage }) {
  const agent = AGENTS[listing.agentId];
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.blue, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        ← Back to Listings
      </button>
      <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, position: "relative", height: 340 }}>
        <img src={listing.img} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
          <Badge label={listing.type} type={listing.type} />
          {listing.tags.map(t => <Badge key={t} label={t} />)}
        </div>
        {listing.verified && <div style={{ position: "absolute", top: 14, right: 14, background: T.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>✓ Verified</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: T.navy }}>{listing.title}</h1>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.blue }}>{listing.price}</div>
          </div>
          <p style={{ color: T.muted, marginBottom: 16, fontSize: 14 }}>📍 {listing.location}</p>

          <div style={{ display: "flex", gap: 20, marginBottom: 20, padding: "14px 18px", background: T.warm, borderRadius: 14 }}>
            {listing.beds > 0 && <StatChip icon="🛏" val={listing.beds} label="Beds" />}
            <StatChip icon="🚿" val={listing.baths} label="Baths" />
            <StatChip icon="📐" val={`${listing.sqft.toLocaleString()} sqft`} label="Area" />
            <StatChip icon="👁" val={listing.views} label="Views" />
          </div>

          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>About This Property</h3>
          <p style={{ color: T.muted, lineHeight: 1.7, fontSize: 14 }}>{listing.desc}</p>
        </div>

        {/* Sticky sidebar */}
        <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, padding: 22, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${T.border}` }}>
            <Avatar initials={agent.initials} size={48} />
            <div>
              <div style={{ fontWeight: 700, color: T.navy, fontSize: 15 }}>{agent.name}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{agent.company}</div>
              <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 2 }}>✓ Verified Agent · {agent.deals} deals</div>
            </div>
          </div>
          <Btn onClick={onInspect} sx={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>
            📅 Schedule Inspection
          </Btn>
          <Btn onClick={onMessage} variant="ghost" sx={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>
            💬 Message Agent
          </Btn>
          <a href={`tel:${agent.phone}`} style={{ display: "block", textAlign: "center", fontSize: 13, color: T.muted, textDecoration: "none", marginTop: 6 }}>📞 {agent.phone}</a>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, val, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.navy }}>{val}</div>
      <div style={{ fontSize: 11, color: T.muted }}>{label}</div>
    </div>
  );
}

/* ─── LISTING CARD ─── */
function ListingCard({ listing, onClick, onInspect, onMessage }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.card, borderRadius: 18, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${T.border}`, transition: "all 0.22s",
        boxShadow: hov ? "0 12px 40px rgba(26,79,168,0.16)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hov ? "translateY(-3px)" : "none",
      }}>
      <div style={{ position: "relative", height: 180 }}>
        <img src={listing.img} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
          <Badge label={listing.type} type={listing.type} />
        </div>
        {listing.verified && <div style={{ position: "absolute", top: 10, right: 10, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>✓ Verified</div>}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 4, lineHeight: 1.3 }}>{listing.title}</div>
        <div style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>📍 {listing.location}</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: T.blue, marginBottom: 10 }}>{listing.price}</div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.muted, marginBottom: 12 }}>
          {listing.beds > 0 && <span>🛏 {listing.beds} beds</span>}
          <span>🚿 {listing.baths} baths</span>
          <span>📐 {listing.sqft.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
          {listing.tags.slice(0, 2).map(t => <Badge key={t} label={t} />)}
        </div>
        <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
          <Btn onClick={onInspect} sx={{ flex: 1, justifyContent: "center", padding: "9px 8px", fontSize: 12 }}>📅 Inspect</Btn>
          <Btn onClick={onMessage} variant="ghost" sx={{ flex: 1, justifyContent: "center", padding: "9px 8px", fontSize: 12 }}>💬 Message</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div style={{
      background: `linear-gradient(160deg, ${T.navy} 0%, #0d2247 55%, #1a3a6e 100%)`,
      padding: "72px 20px 80px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative circles */}
      {[{ s: 380, t: -120, r: -80 }, { s: 260, b: -100, l: -60 }].map((c, i) => (
        <div key={i} style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", top: c.t, right: c.r, bottom: c.b, left: c.l, pointerEvents: "none" }} />
      ))}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 30, padding: "6px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.12)" }}>
          <span style={{ fontSize: 12, color: T.sky, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>🇳🇬 Lagos, Nigeria</span>
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(32px,6vw,54px)", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
          Find Your Next<br /><span style={{ color: T.sky }}>Property in Lagos</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.6, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          Verified listings, virtual tours, and direct agent communication — all in one platform.
        </p>
        <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 8, maxWidth: 520, margin: "0 auto", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && onSearch(q)}
            placeholder="Search by location, type, price…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, padding: "8px 12px", fontFamily: "inherit" }} />
          <Btn onClick={() => onSearch(q)} sx={{ padding: "10px 22px" }}>Search</Btn>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 32 }}>
          {[["1,200+", "Listings"], ["320+", "Agents"], ["78%", "Cost Saved"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ─── */
function Navbar({ page, setPage, user, setUser }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 62, gap: 8 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
            <path d="M6 22L22 6L38 22" stroke="#2e8bff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 19V37H19V28H25V37H33V19" stroke="#1a4fa8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.navy, letterSpacing: -0.5 }}>
            DIA<span style={{ color: T.blue }}>PROP</span>
          </span>
        </button>

        <div style={{ flex: 1 }} />

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[["home", "Browse"], ["agents", "Agents"], ["about", "About"]].map(([k, l]) => (
            <button key={k} onClick={() => setPage(k)}
              style={{ background: page === k ? "#e8f0fb" : "none", border: "none", padding: "7px 14px", borderRadius: 8, color: page === k ? T.blue : T.navy, fontWeight: page === k ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
          {user
            ? <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
                <Avatar initials={user.initials} size={34} />
                <button onClick={() => setUser(null)} style={{ background: "none", border: `1.5px solid ${T.border}`, padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: T.muted, fontFamily: "inherit" }}>Sign Out</button>
              </div>
            : <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                <Btn variant="muted" onClick={() => setPage("login")} sx={{ padding: "8px 16px" }}>Sign In</Btn>
                <Btn onClick={() => setPage("signup")} sx={{ padding: "8px 16px" }}>Get Started</Btn>
              </div>
          }
        </div>
      </div>
    </nav>
  );
}

/* ─── AGENTS PAGE ─── */
function AgentsPage({ onMessage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 6, color: T.navy }}>Verified Agents</h2>
      <p style={{ color: T.muted, marginBottom: 32 }}>Connect directly with Nigeria's top real estate professionals.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 20 }}>
        {Object.entries(AGENTS).map(([id, a]) => (
          <div key={id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <Avatar initials={a.initials} size={52} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{a.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{a.company}</div>
                <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 2 }}>✓ Verified</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>{a.bio}</p>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.blue }}>{a.listings}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Listings</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.blue }}>{a.deals}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Deals</div>
              </div>
            </div>
            <Btn onClick={() => onMessage({ agentId: id, title: "General Enquiry", location: "" })} variant="ghost" sx={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
              💬 Send Message
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ABOUT PAGE ─── */
function AboutPage() {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 36, color: T.navy, marginBottom: 12 }}>About DIAPROP</h1>
        <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
          Nigeria's Digital Property Access Platform — bridging the gap between agents, buyers, and properties through technology.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
        {[
          { icon: "🔍", title: "Verified Listings", desc: "Every listing and agent goes through a rigorous KYC process — NIN, CAC, and utility bill verification." },
          { icon: "🎥", title: "Virtual Inspections", desc: "Live video tours via Google Meet. Inspect from anywhere, save time, reduce wasted site visits." },
          { icon: "💬", title: "Direct Communication", desc: "Chat directly with agents through listings. No third-party intermediaries, no hidden fees." },
          { icon: "📅", title: "Smart Scheduling", desc: "Book physical or virtual inspections in seconds. Get reminders and calendar invites automatically." },
        ].map(f => (
          <div key={f.title} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6, color: T.navy }}>{f.title}</h3>
            <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background: `linear-gradient(135deg,${T.navy},#1a3a6e)`, borderRadius: 20, padding: "32px 36px", color: "#fff", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Market Survey Results</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24, fontSize: 14 }}>154 real estate professionals surveyed in Lagos State</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
          {[["86%", "Cost reduction confirmed"], ["93%", "Want better comms tools"], ["78%", "Willing to pay"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: T.sky }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", maxWidth: 90 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AUTH ─── */
function AuthPage({ mode, onAuth, onToggle }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const submit = () => {
    if (!email || !pass) return;
    onAuth({ name: name || email.split("@")[0], email, initials: (name || email).slice(0, 2).toUpperCase() });
  };
  return (
    <div style={{ maxWidth: 440, margin: "60px auto", padding: "0 20px" }}>
      <div style={{ background: T.card, borderRadius: 22, border: `1px solid ${T.border}`, padding: "36px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: T.navy, marginBottom: 6 }}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </div>
          <p style={{ color: T.muted, fontSize: 14 }}>
            {mode === "signup" ? "Join Nigeria's trusted property platform" : "Sign in to your DIAPROP account"}
          </p>
        </div>
        {mode === "signup" && (
          <Field label="Full Name">
            <input placeholder="Adaeze Nwosu" value={name} onChange={e => setName(e.target.value)} style={inputSx} />
          </Field>
        )}
        <Field label="Email Address" req>
          <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputSx} />
        </Field>
        <Field label="Password" req>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={inputSx} />
        </Field>
        <Btn onClick={submit} sx={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          {mode === "signup" ? "Create Account" : "Sign In"}
        </Btn>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: T.muted }}>
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          {" "}<button onClick={onToggle} style={{ background: "none", border: "none", color: T.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            {mode === "signup" ? "Sign In" : "Sign Up Free"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: T.navy, color: "rgba(255,255,255,0.55)", padding: "36px 20px", marginTop: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 4 }}>
            DIA<span style={{ color: T.sky }}>PROP</span>
          </div>
          <div style={{ fontSize: 12 }}>Digital Property Access Platform · Lagos, Nigeria 🇳🇬</div>
        </div>
        <div style={{ fontSize: 12, display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>{l}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── HOME PAGE ─── */
function HomePage({ onListingClick, onInspect, onMessage, search }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const types = ["All", "Sale", "Rent", "Lease"];

  const filtered = LISTINGS
    .filter(l => filter === "All" || l.type === filter)
    .filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, background: T.warm, borderRadius: 12, padding: 4 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: filter === t ? T.blue : "none", color: filter === t ? "#fff" : T.navy, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: T.muted }}>{filtered.length} properties found</div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 600 }}>No listings found. Try a different search.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px,1fr))", gap: 22 }}>
          {filtered.map(l => (
            <ListingCard key={l.id} listing={l}
              onClick={() => onListingClick(l)}
              onInspect={e => { e.stopPropagation(); onInspect(l); }}
              onMessage={e => { e.stopPropagation(); onMessage(l); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── APP ROOT ─── */
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [activeListing, setActiveListing] = useState(null);
  const [inspectListing, setInspectListing] = useState(null);
  const [messageListing, setMessageListing] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearch = (q) => { setSearch(q); setPage("home"); };

  const handleAuth = (u) => { setUser(u); setPage("home"); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />

      <div style={{ flex: 1 }}>
        {page === "home" && !activeListing && (
          <>
            <Hero onSearch={handleSearch} />
            <HomePage onListingClick={l => setActiveListing(l)} onInspect={setInspectListing} onMessage={setMessageListing} search={search} />
          </>
        )}
        {page === "home" && activeListing && (
          <ListingDetail listing={activeListing} onBack={() => setActiveListing(null)} onInspect={() => setInspectListing(activeListing)} onMessage={() => setMessageListing(activeListing)} />
        )}
        {page === "agents" && <AgentsPage onMessage={setMessageListing} />}
        {page === "about" && <AboutPage />}
        {(page === "login" || page === "signup") && (
          <AuthPage mode={page} onAuth={handleAuth} onToggle={() => setPage(page === "login" ? "signup" : "login")} />
        )}
      </div>

      <Footer />

      {inspectListing && <InspectionModal listing={inspectListing} onClose={() => setInspectListing(null)} />}
      {messageListing && <MessageModal listing={messageListing} onClose={() => setMessageListing(null)} />}
    </div>
  );
}
