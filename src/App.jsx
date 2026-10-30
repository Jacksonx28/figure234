import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Search,
  X,
  Menu,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fetchCatalogue,
  money,
  whatsappLink,
  readBag,
  variantKey,
} from "./catalogue";
import "./App.css";
import snapshot from "./catalogue-snapshot.json";
const savedCatalogue = snapshot.products.map((p) => ({
  ...p,
  img: `${import.meta.env.BASE_URL}editorial/${p.editorial}.jpg`,
}));

const editorial = (name) => `${import.meta.env.BASE_URL}editorial/${name}.jpg`;
const views = ["home", "collections", "archive", "enquiries"];
const currentView = () =>
  views.includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";

function ProductImage({ item, ...props }) {
  const [failed, setFailed] = useState(false);
  return item.img && !failed ? (
    <img
      src={item.img}
      alt={item.name}
      loading="lazy"
      onError={() => setFailed(true)}
      {...props}
    />
  ) : (
    <div className="image-placeholder">Image available on request</div>
  );
}

function Dialog({ title, className = "", onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        className="dialog-close icon-button"
        type="button"
        aria-label={`Close ${title.toLowerCase()}`}
        onClick={onClose}
      >
        <X size={21} />
      </button>
      {children}
    </dialog>
  );
}

function ProductDetail({ item, onClose, onAdd }) {
  const [height, setHeight] = useState(item.heights[0]);
  const [color, setColor] = useState(item.colors[0]);
  return (
    <Dialog title="Piece details" className="product-dialog" onClose={onClose}>
      <div className="detail-art">
        <ProductImage item={item} />
      </div>
      <div className="detail-copy">
        <span className="eyebrow">The {item.section} collection</span>
        <h2>{item.name}</h2>
        <p className="detail-price">{money(item.price)}</p>
        <p className="detail-intro">
          A characterful addition to your space. Choose your preferred size and
          colour for your enquiry.
        </p>
        <fieldset>
          <legend>Size</legend>
          <div className="option-group">
            {item.heights.map((h) => (
              <button
                className={h === height ? "selected" : ""}
                type="button"
                key={h}
                aria-pressed={h === height}
                onClick={() => setHeight(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>
            Colour <span>{color}</span>
          </legend>
          <div className="option-group colours">
            {item.colors.map((c) => (
              <button
                className={c === color ? "selected" : ""}
                type="button"
                key={c}
                aria-pressed={c === color}
                onClick={() => setColor(c)}
              >
                <i style={{ backgroundColor: c.toLowerCase() }} />
                {c}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          className="button gold"
          type="button"
          onClick={() =>
            onAdd({
              ...item,
              selectedHeight: height,
              selectedColor: color,
              quantity: 1,
            })
          }
        >
          Add to enquiry bag <Plus size={17} />
        </button>
        <p className="fine-print">
          Availability, finish and final price are confirmed by the team before
          an order is placed.
        </p>
        <button type="button" className="text-link" onClick={onClose}>
          ← Back to the collection
        </button>
      </div>
    </Dialog>
  );
}

function Bag({ cart, setCart, onClose }) {
  const [draft, setDraft] = useState(false);
  const quantity = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const allPriced = cart.every((i) => Number.isFinite(i.price));
  const update = (key, delta) => {
    setDraft(false);
    setCart((old) =>
      old.map((i) =>
        variantKey(i) === key
          ? { ...i, quantity: Math.min(99, Math.max(1, i.quantity + delta)) }
          : i,
      ),
    );
  };
  const remove = (key) => {
    setDraft(false);
    setCart((old) => old.filter((i) => variantKey(i) !== key));
  };
  const message = `Hello Figure234, I’d like to enquire about these pieces:\n\n${cart.map((i) => `• ${i.name}\n  Size: ${i.selectedHeight} / Colour: ${i.selectedColor}\n  Quantity: ${i.quantity} / Listed price: ${money(i.price)} each`).join("\n\n")}\n\n${allPriced ? "Estimated subtotal" : "Priced items subtotal"}: ${money(subtotal)}\nPlease confirm availability, final prices and delivery options. Thank you.`;
  return (
    <Dialog title="Enquiry bag" className="bag-dialog" onClose={onClose}>
      <div className="bag-heading">
        <span className="eyebrow">Your selection</span>
        <h2>
          The enquiry bag <span>({quantity})</span>
        </h2>
      </div>
      {cart.length === 0 ? (
        <div className="empty-bag">
          <ShoppingBag size={35} strokeWidth={1} />
          <h3>Good taste starts somewhere.</h3>
          <p>Explore the collection and add a piece that speaks to you.</p>
          <a className="button gold" href="#collections" onClick={onClose}>
            Discover the collection <ArrowRight size={18} />
          </a>
        </div>
      ) : (
        <>
          <div className="bag-items">
            {cart.map((item) => (
              <article key={variantKey(item)} className="bag-item">
                <ProductImage item={item} />
                <div className="bag-item-copy">
                  <h3>{item.name}</h3>
                  <p>
                    {item.selectedHeight} / {item.selectedColor}
                  </p>
                  <strong>{money(item.price)}</strong>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity === 1}
                      onClick={() => update(variantKey(item), -1)}
                    >
                      <Minus size={13} />
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      disabled={item.quantity === 99}
                      onClick={() => update(variantKey(item), 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <button
                  className="remove-item icon-button"
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(variantKey(item))}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
          <div className="bag-bottom">
            <div className="subtotal">
              <span>
                {allPriced ? "Estimated subtotal" : "Priced items subtotal"}
              </span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p className="fine-print">
              Confirm prices and delivery with the team. Adding a piece does not
              reserve it or place an order.
            </p>
            {draft ? (
              <div className="bag-draft">
                <span className="eyebrow">Your message is ready</span>
                <pre>{message}</pre>
                <a
                  className="button gold"
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue to WhatsApp <ArrowUpRight size={18} />
                </a>
                <p className="fine-print">
                  Review and send in WhatsApp. Nothing has been sent yet.
                </p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setDraft(false)}
                >
                  ← Back to your selection
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="button gold"
                onClick={() => setDraft(true)}
              >
                Prepare an enquiry <ArrowRight size={18} />
              </button>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
}

function ProductCard({ item, index, onSelect }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="product-card"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <button
        className="product-art"
        onClick={() => onSelect(item)}
        aria-label={`View ${item.name}`}
      >
        <ProductImage item={item} />
        <span className="product-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="art-action">
          <Plus size={20} />
        </span>
      </button>
      <div className="product-info">
        <div>
          <span className="eyebrow">{item.section}</span>
          <h3>
            <button onClick={() => onSelect(item)}>{item.name}</button>
          </h3>
        </div>
        <span className="product-price">{money(item.price)}</span>
      </div>
      <div className="product-bottom">
        <span>
          {item.heights.join(" / ")} · {item.colors.length}{" "}
          {item.colors.length === 1 ? "colour" : "colours"}
        </span>
        <button
          onClick={() => onSelect(item)}
          aria-label={`Choose options for ${item.name}`}
        >
          Choose options <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.article>
  );
}

function CollectionNotice({ retry, loading }) {
  return (
    <div className="collection-notice">
      <p>Collection preview · confirm current availability with the team.</p>
      <button type="button" onClick={retry} disabled={loading}>
        {loading ? "Refreshing…" : "Refresh collection"}
      </button>
    </div>
  );
}

function CatalogueState({ loading, error, retry }) {
  if (loading)
    return (
      <div className="catalogue-state" role="status">
        <div className="loading-line" />
        <p>Curating your view…</p>
      </div>
    );
  return (
    <div className="catalogue-state">
      <h3>
        {error
          ? "The collection is taking a moment."
          : "A new chapter is on its way."}
      </h3>
      <p>
        {error
          ? "Please try again, or speak with the team about a piece."
          : "Enquire with the team for current pieces and availability."}
      </p>
      <div className="button-row">
        {error && (
          <button className="button outline" onClick={retry}>
            Try again <ArrowRight size={16} />
          </button>
        )}
        <a className="text-link" href="#enquiries">
          Speak with the team <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
  );
}

function Home({ products, loading, error, retry, onSelect, usingSaved }) {
  return (
    <>
      <section className="home-hero" id="home">
        <div className="hero-left">
          <span className="eyebrow">
            <i /> Curated objects. Uncommon character.
          </span>
          <h1>
            Art with
            <br />a point
            <br />
            of <em>view.</em>
          </h1>
          <p>
            Collectible figures and artful objects for spaces with personality.
          </p>
          <a className="button gold" href="#collections">
            Enter the collection <ArrowUpRight size={19} />
          </a>
          <div className="hero-foot">
            <span>
              Bold art.
              <br />
              Elite class.
            </span>
            <span>
              Lagos, Nigeria
              <br />
              Worldwide enquiries
            </span>
          </div>
        </div>
        <a
          href="#collections"
          className="hero-right"
          aria-label="Discover the Figure234 collection"
        >
          <div className="gallery-topline">
            <span>THE FIGURE234 EDIT</span>
            <span>OBJECT / 001</span>
          </div>
          <div className="hero-object">
            <img
              src={editorial("share")}
              alt="Kaws Share collectible figure with a smaller companion"
              fetchPriority="high"
            />
          </div>
          <div className="gallery-caption">
            <div>
              <span className="eyebrow">In focus</span>
              <h2>Kaws Share</h2>
            </div>
            <span className="circle-arrow">
              <ArrowUpRight size={22} />
            </span>
          </div>
          <span className="hero-watermark" aria-hidden="true">
            234
          </span>
        </a>
      </section>
      <div className="brand-rail">
        <span>Art toys & collectibles</span>
        <span className="rail-mark" aria-hidden="true">
          ✳
        </span>
        <span>Objects with presence</span>
        <span className="rail-mark" aria-hidden="true">
          ✳
        </span>
        <span>Lagos to the world</span>
      </div>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A closer look</span>
            <h2>
              Find your <em>next piece.</em>
            </h2>
          </div>
          <a className="text-link" href="#collections">
            Explore all pieces <ArrowUpRight size={17} />
          </a>
        </div>
        {usingSaved && <CollectionNotice retry={retry} loading={loading} />}{" "}
        {(loading && !products.length) || error || !products.length ? (
          <CatalogueState loading={loading} error={error} retry={retry} />
        ) : (
          <div className="product-grid home-products">
            {products.slice(0, 3).map((item, index) => (
              <ProductCard
                item={item}
                index={index}
                key={item.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </section>
      <section className="collector-note">
        <div className="wrap collector-grid">
          <div className="collector-image">
            <img
              src={editorial("small-lie")}
              alt="Three Kaws Small Lie figures in grey, brown and black"
              loading="lazy"
            />
            <span>Objects, collected with intention.</span>
          </div>
          <div className="collector-copy">
            <span className="eyebrow">For the collector in you</span>
            <h2>
              Not just an object.
              <br />
              <em>A conversation.</em>
            </h2>
            <p>
              The right piece changes how a space feels. Start with a character
              you connect with, a silhouette that holds your attention, or a
              detail that makes you look twice.
            </p>
            <a className="text-link" href="#archive">
              Explore the art of collecting <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <section className="section wrap how-it-works">
        <div>
          <span className="eyebrow">From discovery to your space</span>
          <h2>
            A more personal
            <br />
            way to <em>collect.</em>
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Find your piece.</h3>
              <p>
                Explore the collection and choose your preferred size and
                colour.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Build your selection.</h3>
              <p>
                Add pieces to your enquiry bag, ready for a conversation with
                the team.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Make it yours.</h3>
              <p>
                Confirm availability, final pricing and delivery directly before
                placing an order.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
}

function Collections({
  products,
  loading,
  error,
  retry,
  onSelect,
  usingSaved,
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("curated");
  const categories = ["all", ...new Set(products.map((p) => p.section))];
  const filtered = products.filter(
    (p) =>
      (category === "all" || p.section === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  if (sort === "low")
    filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "high")
    filtered.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  return (
    <>
      <section className="page-heading wrap">
        <span className="eyebrow">The collection</span>
        <h1>
          For the eye.
          <br />
          <em>For your space.</em>
        </h1>
        <div className="heading-bottom">
          <p>
            Distinctive figures and objects. Find the one that feels like you.
          </p>
          <span>
            {loading ? "Curating…" : `${products.length} pieces to explore`}
          </span>
        </div>
      </section>
      <section className="wrap collection-section">
        {usingSaved && <CollectionNotice retry={retry} loading={loading} />}
        <div className="collection-tools">
          <div
            className="category-filters"
            role="group"
            aria-label="Filter collection"
          >
            {categories.map((c) => (
              <button
                className={category === c ? "selected" : ""}
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c === "all" ? "All pieces" : c}
                <span>
                  {c === "all"
                    ? products.length
                    : products.filter((p) => p.section === c).length}
                </span>
              </button>
            ))}
          </div>
          <label className="search-field">
            <Search size={16} />
            <span className="sr-only">Search pieces</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a piece…"
            />
          </label>
        </div>
        <div className="collection-summary">
          <p aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            {query ? ` matching “${query}”` : ""}
          </p>
          <label>
            Sort by{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="curated">Curated order</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        {(loading && !products.length) || error || !products.length ? (
          <CatalogueState loading={loading} error={error} retry={retry} />
        ) : filtered.length ? (
          <div className="product-grid">
            {filtered.map((item, index) => (
              <ProductCard
                item={item}
                index={index}
                key={item.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="catalogue-state">
            <h3>No pieces in this view.</h3>
            <p>Try a different name or explore the full collection.</p>
            <button
              className="text-link"
              onClick={() => {
                setCategory("all");
                setQuery("");
              }}
            >
              Reset filters <ArrowRight size={17} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function Archive() {
  return (
    <>
      <section className="page-heading wrap">
        <span className="eyebrow">The journal / 001</span>
        <h1>
          Small objects.
          <br />
          <em>Big personalities.</em>
        </h1>
        <div className="heading-bottom">
          <p>
            A closer look at the figures, characters and details that make a
            collection personal.
          </p>
          <span>The art of collecting</span>
        </div>
      </section>
      <section className="wrap journal-grid">
        <div className="journal-photo">
          <img
            src={editorial("passing-through")}
            alt="Kaws Passing Through figure seated beside its packaging"
          />
          <span>Figure study / Passing Through</span>
        </div>
        <article>
          <span className="eyebrow">A place to begin</span>
          <h2>
            Collect what
            <br />
            <em>moves you.</em>
          </h2>
          <p className="journal-lead">
            A good collection starts with curiosity. A shape, a character, a
            colour. Something you want to spend a little more time with.
          </p>
          <p>
            Art toys sit at the meeting point of sculpture, character design and
            everyday interiors. Their scale invites a closer look; their
            personality gives a shelf or room a distinct point of view.
          </p>
          <h3>Give a piece room to speak.</h3>
          <p>
            Think about where it will live. A single figure can hold a quiet
            corner; a small grouping can create a conversation between shapes
            and colours. Leave a little space around each piece.
          </p>
          <h3>Ask before you acquire.</h3>
          <p>
            Check the dimensions, materials, finish and condition with the team.
            If packaging, edition details or provenance matter to you, ask for
            photographs and documentation before confirming an order.
          </p>
          <a className="button gold" href="#collections">
            Find your starting point <ArrowRight size={18} />
          </a>
        </article>
      </section>
    </>
  );
}

function Enquiries() {
  const [draft, setDraft] = useState(null);
  const reviewRef = useRef(null);
  useEffect(() => {
    if (draft) reviewRef.current?.focus();
  }, [draft]);
  return (
    <section className="enquiries-layout wrap">
      <div>
        <span className="eyebrow">A personal conversation</span>
        <h1>
          Find it.
          <br />
          Love it.
          <br />
          <em>Let’s talk.</em>
        </h1>
        <p>
          A question about a piece, a sourcing request or a new addition to your
          space. Tell us what you have in mind.
        </p>
        <div className="direct-contact">
          <span className="eyebrow">Speak with the team</span>
          <a
            href={whatsappLink(
              "Hello Figure234, I’d like to enquire about the collection.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            +234 807 777 8313 <ArrowUpRight size={17} />
          </a>
          <a href="mailto:info@figure234.com">
            info@figure234.com <ArrowUpRight size={17} />
          </a>
        </div>
        <span className="enquiry-wordmark" aria-hidden="true">
          234.
        </span>
      </div>
      <div className="enquiry-form-box">
        <span className="eyebrow">The concierge</span>
        <h2>
          A piece in <em>mind?</em>
        </h2>
        {draft && (
          <div
            className="enquiry-review"
            aria-live="polite"
            tabIndex={-1}
            ref={reviewRef}
          >
            <h3>Your message is ready.</h3>
            <p>Review the details, then continue to WhatsApp to send it.</p>
            <pre>{draft}</pre>
            <a
              className="button gold"
              href={whatsappLink(draft)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue to WhatsApp <ArrowUpRight size={18} />
            </a>
            <button
              type="button"
              className="text-link"
              onClick={() => setDraft(null)}
            >
              ← Edit your enquiry
            </button>
            <p className="fine-print">Your message has not been sent.</p>
          </div>
        )}
        <div hidden={Boolean(draft)}>
          <EnquiryForm onDraft={setDraft} />
        </div>
      </div>
    </section>
  );
}

function EnquiryForm({ onDraft }) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    interest: "Collectibles",
    message: "",
  });
  function change(e) {
    const next = { ...fields, [e.target.name]: e.target.value };
    setFields(next);
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onDraft(
          `Hello Figure234,\n\nName: ${fields.name.trim()}\nEmail: ${fields.email}\nInterest: ${fields.interest}\n\n${fields.message.trim()}`,
        );
      }}
    >
      <label>
        Your name
        <input
          name="name"
          value={fields.name}
          onChange={change}
          autoComplete="name"
          maxLength={100}
          required
          placeholder="Full name"
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          value={fields.email}
          onChange={change}
          autoComplete="email"
          required
          maxLength={160}
          placeholder="you@example.com"
        />
      </label>
      <label>
        I’m interested in
        <select name="interest" value={fields.interest} onChange={change}>
          <option>Collectibles</option>
          <option>Art decor</option>
          <option>Sourcing a piece</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        Tell us a little more
        <textarea
          name="message"
          value={fields.message}
          onChange={change}
          rows={5}
          maxLength={2000}
          required
          placeholder="A particular piece, size or colour…"
        />
      </label>
      <button className="button gold" type="submit">
        Prepare my enquiry <ArrowRight size={18} />
      </button>
      <p className="fine-print">
        You’ll review the message before sending it in WhatsApp.
      </p>
    </form>
  );
}

export default function App() {
  const [view, setView] = useState(currentView);
  const [products, setProducts] = useState(savedCatalogue);
  const [usingSaved, setUsingSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cart, setCart] = useState(readBag);
  const [bag, setBag] = useState(false);
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const onHash = () => {
      setView(currentView());
      setMenu(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.title = `${{ home: "Art with a point of view", collections: "The collection", archive: "The art of collecting", enquiries: "Private enquiries" }[view]} | Figure234`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchCatalogue()
      .then((data) => {
        if (active) {
          setProducts(data);
          setUsingSaved(false);
        }
      })
      .catch(() => {
        if (active) {
          setUsingSaved(true);
          setError(savedCatalogue.length === 0);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    try {
      localStorage.setItem("figure234-bag-v2", JSON.stringify(cart));
    } catch {
      /* Enquiries still work with memory-only state. */
    }
  }, [cart]);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const add = (item) => {
    setCart((old) => {
      const existing = old.find((i) => variantKey(i) === variantKey(item));
      return existing
        ? old.map((i) =>
            variantKey(i) === variantKey(item)
              ? { ...i, quantity: Math.min(99, i.quantity + 1) }
              : i,
          )
        : [...old, item];
    });
    setSelected(null);
    setBag(true);
  };
  const catalogueProps = {
    products,
    loading,
    error,
    retry: () => setAttempt((n) => n + 1),
    onSelect: setSelected,
    usingSaved,
  };
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Figure234, home">
          FIGURE<span>234</span>
          <small>ART. OBJECTS. CHARACTER.</small>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a
            href="#collections"
            aria-current={view === "collections" ? "page" : undefined}
          >
            The collection
          </a>
          <a
            href="#archive"
            aria-current={view === "archive" ? "page" : undefined}
          >
            The journal
          </a>
          <a
            href="#enquiries"
            aria-current={view === "enquiries" ? "page" : undefined}
          >
            Enquiries <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="bag-toggle"
            onClick={() => setBag(true)}
            aria-label={`Open enquiry bag, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag size={17} />
            <span>Bag</span>
            <b aria-live="polite">{String(count).padStart(2, "0")}</b>
          </button>
          <button
            className="menu-toggle icon-button"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <main id="content" tabIndex={-1}>
        {view === "home" ? (
          <Home {...catalogueProps} />
        ) : view === "collections" ? (
          <Collections {...catalogueProps} />
        ) : view === "archive" ? (
          <Archive />
        ) : (
          <Enquiries />
        )}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-top">
          <div>
            <span className="eyebrow">Good objects find their people.</span>
            <h2>
              Something caught
              <br />
              <em>your eye?</em>
            </h2>
            <a href="#enquiries" className="text-link">
              Let’s find your next piece <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="footer-links">
            <div>
              <span className="eyebrow">Explore</span>
              <a href="#collections">The collection</a>
              <a href="#archive">The journal</a>
              <a href="#enquiries">Private enquiries</a>
            </div>
            <div>
              <span className="eyebrow">Connect</span>
              <a
                href="https://www.instagram.com/figure234.ng/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <ArrowUpRight size={13} />
              </a>
              <a
                href={whatsappLink(
                  "Hello Figure234, I’d like to enquire about the collection.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <ArrowUpRight size={13} />
              </a>
              <a href="mailto:info@figure234.com">
                Email <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          FIGURE<span>234</span>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Figure234</span>
          <span>Lagos, Nigeria / Worldwide enquiries</span>
          <a href="#home">Back to the beginning ↑</a>
        </div>
      </footer>
      {selected && (
        <ProductDetail
          item={selected}
          onClose={() => setSelected(null)}
          onAdd={add}
        />
      )}
      {bag && (
        <Bag cart={cart} setCart={setCart} onClose={() => setBag(false)} />
      )}
      {menu && (
        <Dialog
          title="Menu"
          className="menu-dialog"
          onClose={() => setMenu(false)}
        >
          <span className="eyebrow">Explore Figure234</span>
          {[
            ["home", "The beginning"],
            ["collections", "The collection"],
            ["archive", "The journal"],
            ["enquiries", "Enquiries"],
          ].map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight size={24} />
            </a>
          ))}
          <p>Lagos, Nigeria / Worldwide enquiries</p>
        </Dialog>
      )}
    </>
  );
}
