import { cloneElement, isValidElement, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import PlayerCloud from './PlayerCloud';
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  Heart,
  Landmark,
  Moon,
  Plus,
  Printer,
  Search,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { places, regions, normalize } from "../data";
import { worldHouses } from "../lore/world-polities";
import HeraldicCrest from "../HeraldicCrest";
import {
  abilityIds,
  type AbilityId,
  type ClassId,
  type PlayerCharacter,
  type PlayerSpell,
  type SkillId,
} from "./types";
import {
  newPlayerCharacter,
  loadPlayers,
  savePlayers,
  importPlayerFile,
  exportPlayerCharacter,
  playerStorageKey,
  shortRest,
  longRest,
  useHitDie,
  spendSpellSlot,
  spendPactSlot,
  spendArcanum,
  applyDamage,
  heal,
} from "./model";
import {
  abilityModifier,
  classDefinitions,
  skills,
  races,
  backgrounds,
  subclasses,
  armorDefinitions,
  derivedStats,
  savingThrow,
  skillBonus,
  spellLimits,
  canSelectSpell,
  characterWarnings,
  isThirdCaster,
  alwaysPreparedSpellIds,
  canRitualCast,
  spellChoiceCounts,
} from "./rules";
import {
  loadPlayerSpells,
  readCustomPlayerSpells,
  removeCustomPlayerSpell,
  customSpellStorageKey,
} from "./spells";
import PlayerSheet from "./PlayerSheet";
import CharacterCreationGuide from "./CharacterCreationGuide";
import AbilityScoreBuilder from "./AbilityScoreBuilder";
import EquipmentCatalog from "./EquipmentCatalog";
import SpellArchiveTools from "./SpellArchiveTools";
import StartingSpells from "./StartingSpells";
import CharacterRulesReference from "./CharacterRulesReference";
import { printPlayerSheet } from "./print";
import "./player-workshop.css";

const abilityNames: Record<AbilityId, string> = {
  str: "Kuvvet",
  dex: "Çeviklik",
  con: "Dayanıklılık",
  int: "Zekâ",
  wis: "Bilgelik",
  cha: "Karizma",
};
const abilityAbbr: Record<AbilityId, string> = {
  str: "KUV",
  dex: "ÇEV",
  con: "DAY",
  int: "ZEK",
  wis: "BİL",
  cha: "KAR",
};
const schools: Record<string, string> = {
  abjuration: "Koruma",
  conjuration: "Çağırma",
  divination: "Kehanet",
  enchantment: "Efsun",
  evocation: "Evokasyon",
  illusion: "Yanılsama",
  necromancy: "Nekromansi",
  transmutation: "Dönüşüm",
};
const conditionNames = [
  "Büyülenmiş",
  "Dehşete kapılmış",
  "Felçli",
  "Görünmez",
  "Kavranmış",
  "Kör",
  "Korkmuş",
  "Kısıtlanmış",
  "Sağır",
  "Sersemlemiş",
  "Taşlaşmış",
  "Yerde",
  "Zehirlenmiş",
  "Bilinçsiz",
];
const tabs = [
  {
    id: "identity",
    name: "Kimlik",
    icon: UserRound,
    note: "Bir isim, bir köken",
  },
  {
    id: "abilities",
    name: "Nitelikler",
    icon: Shield,
    note: "Güçlü olduğun şeyler",
  },
  {
    id: "adventure",
    name: "Macerada",
    icon: Swords,
    note: "Can, savaş ve dinlenme",
  },
  {
    id: "spells",
    name: "Büyüler",
    icon: Sparkles,
    note: "Büyü defteri ve yuvalar",
  },
  {
    id: "equipment",
    name: "Eşya",
    icon: Backpack,
    note: "Yanında taşıdıkların",
  },
  { id: "story", name: "Hikâye", icon: BookOpen, note: "Sözlerin ve geçmişin" },
  {
    id: "sheet",
    name: "A4 kâğıt",
    icon: Printer,
    note: "Masaya götüreceğin nüsha",
  },
] as const;
type Tab = (typeof tabs)[number]["id"];
type Modal = "create" | "delete" | "long-rest" | "short-rest" | null;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const number = (value: string, min = 0, max = 999999) =>
  Math.trunc(clamp(Number(value), min, max));
const signed = (value: number) => (value >= 0 ? "+" + value : String(value));
const id = () =>
  crypto.randomUUID?.() ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);
function die(sides: number) {
  const values = new Uint32Array(1),
    limit = Math.floor(0x100000000 / sides) * sides;
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return (values[0] % sides) + 1;
}
function Field({
  label,
  children,
  hint,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  wide?: boolean;
}) {
  const fieldId = useId();
  const control = isValidElement<{ 'aria-label'?:string;'aria-labelledby'?:string;'aria-describedby'?:string }>(children)
    ? cloneElement(children, { ...(children.props['aria-label'] ? {} : {'aria-labelledby':fieldId}), ...(hint ? {'aria-describedby':fieldId+'-hint'} : {}) }) : children;
  return (
    <label className={"pw-field" + (wide ? " pw-field-wide" : "")}>
      <span id={fieldId}>{label}</span>
      {control}
      {hint && <small id={fieldId+'-hint'}>{hint}</small>}
    </label>
  );
}
function Section({
  eyebrow,
  title,
  description,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="pw-section">
      <header>
        {eyebrow && <span className="pw-eyebrow">{eyebrow}</span>}
        <div>
          <h2>{title}</h2>
          {action}
        </div>
        {description && <p>{description}</p>}
      </header>
      {children}
    </section>
  );
}
function DownloadFile({ name, value }: { name: string; value: string }) {
  const url = URL.createObjectURL(
      new Blob([value], { type: "application/json;charset=utf-8" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function portraitFile(file: File) {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 6 * 1024 * 1024
  )
    throw Error("JPEG, PNG veya WebP seç; dosya en fazla 6 MB olabilir.");
  const image = new Image(),
    url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(Error("Portre açılamadı."));
      image.src = url;
    });
    const scale = Math.min(
        1,
        640 / image.naturalWidth,
        800 / image.naturalHeight,
      ),
      canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw Error("Portre hazırlanamadı.");
    context.fillStyle = "#d8cbb0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function PlayerWorkshop({
  navigate,
  route = "/play",
}: {
  navigate: (path: string) => void;
  route?: string;
}) {
  const [initial] = useState(() => {
    try {
      return { players: loadPlayers(), error: "" };
    } catch (e) {
      return { players: [] as PlayerCharacter[], error: (e as Error).message };
    }
  });
  const [players, setPlayers] = useState<PlayerCharacter[]>(initial.players),
    [loadError, setLoadError] = useState(initial.error),
    [tab, setTab] = useState<Tab>("identity"),
    [modal, setModal] = useState<Modal>(null);
  const [newName, setNewName] = useState(""),
    [newClass, setNewClass] = useState<ClassId>("fighter"),
    [newLevel, setNewLevel] = useState(1);
  const [search, setSearch] = useState(""),
    [message, setMessage] = useState(""),
    [saved, setSaved] = useState("Bu tarayıcıda kayıtlı"),
    [spellError, setSpellError] = useState("");
  const [spells, setSpells] = useState<PlayerSpell[]>([]),
    [spellQuery, setSpellQuery] = useState(""),
    [spellClass, setSpellClass] = useState("character"),
    [spellLevel, setSpellLevel] = useState("all"),
    [spellSchool, setSpellSchool] = useState("all"),
    [onlyEligible, setOnlyEligible] = useState(false),
    [onlyBook, setOnlyBook] = useState(false),
    [spellLimit, setSpellLimit] = useState(30),
    [selectedSpell, setSelectedSpell] = useState("");
  const [damage, setDamage] = useState(1),
    [spellCastLevel, setSpellCastLevel] = useState(1),
    [rollMessage, setRollMessage] = useState(""),
    [originRegion, setOriginRegion] = useState("all"),
    [restSupplies, setRestSupplies] = useState(false);
  const upload = useRef<HTMLInputElement>(null),
    portraitUpload = useRef<HTMLInputElement>(null),
    modalDialog = useRef<HTMLDialogElement>(null),
    selectedSpellDialog = useRef<HTMLDialogElement>(null);
  let requested = "";
  try {
    requested = decodeURIComponent(route.split("?")[0].split("/")[2] || "");
  } catch {
    /* A malformed route becomes the missing-character view. */
  }
  const character = players.find((c) => c.id === requested),
    definition = classDefinitions.find((c) => c.id === character?.classId),
    stats = character ? derivedStats(character) : null,
    limits = character ? spellLimits(character) : null;
  const selectedHouse = worldHouses.find(
    (house) => house.id === character?.houseId,
  );
  const spell = spells.find((s) => s.id === selectedSpell);
  const warnings = character ? characterWarnings(character, spells) : [];
  const alwaysPrepared = character
    ? new Set(alwaysPreparedSpellIds(character))
    : new Set<string>();
  const customSpellIds = useMemo(() => {
    try {
      return new Set(readCustomPlayerSpells().map((s) => s.id));
    } catch {
      return new Set<string>();
    }
  }, [spells]);
  useEffect(() => {
    if (loadError) {
      setSaved("Eski kayıt korunuyor");
      return;
    }
    try {
      savePlayers(players);
      setSaved("Bu tarayıcıya kaydedildi");
    } catch (e) {
      setSaved("Kayıt yapılamadı");
      setMessage(
        (e as Error).message || "Yerel alan dolu. JSON yedeğini indir.",
      );
    }
  }, [players, loadError]);
  useEffect(() => {
    let active = true;
    loadPlayerSpells()
      .then((next) => {
        if (active) {
          setSpells(next);
          setSpellError("");
        }
      })
      .catch((e) => {
        if (active) setSpellError((e as Error).message);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (modal && !modalDialog.current?.open) modalDialog.current?.showModal();
    if (!modal && modalDialog.current?.open) modalDialog.current.close();
  }, [modal]);
  useEffect(() => {
    if (spell && !selectedSpellDialog.current?.open)
      selectedSpellDialog.current?.showModal();
    if (!spell && selectedSpellDialog.current?.open)
      selectedSpellDialog.current.close();
  }, [spell]);
  useEffect(() => {
    setTab("identity");
    setSelectedSpell("");
    setRollMessage("");
  }, [requested]);
  useEffect(() => {
    setSpellLimit(30);
  }, [spellQuery, spellClass, spellLevel, spellSchool, onlyEligible, onlyBook]);
  function update(
    change:
      | Partial<PlayerCharacter>
      | ((current: PlayerCharacter) => PlayerCharacter),
  ) {
    if (!character) return;
    setPlayers((previous) =>
      previous.map((current) =>
        current.id !== character.id
          ? current
          : {
              ...(typeof change === "function"
                ? change(current)
                : { ...current, ...change }),
              updatedAt: new Date().toISOString(),
            },
      ),
    );
  }
  function create() {
    if (loadError) {
      setMessage(
        "Önce kayıt sorununu çöz veya geçerli bir karakter yedeği aç. Eski veri korunuyor.",
      );
      return;
    }
    if (players.length >= 20) {
      setMessage(
        "Bu tarayıcıda 20 karakter var. Önce yedeğini indirip kullanmadığını kaldır.",
      );
      return;
    }
    const c = newPlayerCharacter(newClass);
    c.name = newName.trim() || "İsimsiz Yolcu";
    c.level = newLevel;
    c.hp = derivedStats(c).maxHp;
    setPlayers((previous) => [...previous, c]);
    setModal(null);
    setNewName("");
    navigate("/play/" + c.id);
    setMessage("Karakterin açıldı. Önce kimliğini ve niteliklerini tamamla.");
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 12 * 1024 * 1024)
        throw Error("Karakter dosyası en fazla 12 MB olabilir.");
      const incoming = importPlayerFile(await file.text());
      if (!incoming.length) throw Error("Yedek dosyasında karakter yok.");
      if (players.length + incoming.length > 20)
        throw Error(
          "Toplam 20 karakter sınırı aşılır. Önce eski karakterlerini yedekle.",
        );
      const copy = incoming.map((c) => ({
        ...c,
        id: players.some((existing) => existing.id === c.id) ? id() : c.id,
        updatedAt: new Date().toISOString(),
      }));
      if (loadError) {
        savePlayers(copy);
        setLoadError("");
      }
      setPlayers((previous) => [...previous, ...copy]);
      navigate("/play/" + copy[0].id);
      setMessage(
        `${copy.length} karakter içe alındı. Var olan geçerli kayıtların korundu.`,
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  function duplicate() {
    if (!character || players.length >= 20) return;
    const copy = {
      ...structuredClone(character),
      id: id(),
      name: character.name + " · kopya",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlayers((previous) => [...previous, copy]);
    navigate("/play/" + copy.id);
    setMessage("Karakterin bağımsız bir kopyası açıldı.");
  }
  function roll(label: string, modifier: number) {
    const value = die(20);
    setRollMessage(
      `${label}: d20 (${value}) ${modifier < 0 ? "−" : "+"} ${Math.abs(modifier)} = ${value + modifier}`,
    );
  }
  function changeHp(healing: boolean) {
    if (!character || !stats) return;
    try {
      update(
        healing ? heal(character, damage) : applyDamage(character, damage),
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  function setStandard(rolled = false) {
    if (!character) return;
    const priority: Record<ClassId, AbilityId[]> = {
      barbarian: ["str", "con", "dex", "wis", "cha", "int"],
      bard: ["cha", "dex", "con", "wis", "int", "str"],
      cleric: ["wis", "con", "str", "cha", "dex", "int"],
      druid: ["wis", "con", "dex", "int", "cha", "str"],
      fighter: ["str", "con", "dex", "wis", "cha", "int"],
      monk: ["dex", "wis", "con", "str", "int", "cha"],
      paladin: ["str", "cha", "con", "wis", "dex", "int"],
      ranger: ["dex", "wis", "con", "str", "int", "cha"],
      rogue: ["dex", "int", "con", "wis", "cha", "str"],
      sorcerer: ["cha", "con", "dex", "wis", "int", "str"],
      warlock: ["cha", "con", "dex", "wis", "int", "str"],
      wizard: ["int", "dex", "con", "wis", "cha", "str"],
    };
    const values = rolled
      ? Array.from({ length: 6 }, () => {
          const dice = Array.from({ length: 4 }, () => die(6)).sort(
            (a, b) => b - a,
          );
          return dice.slice(0, 3).reduce((a, b) => a + b, 0);
        }).sort((a, b) => b - a)
      : [15, 14, 13, 12, 10, 8];
    const scores = { ...character.scores };
    priority[character.classId].forEach(
      (ability, index) => (scores[ability] = values[index]),
    );
    update({ scores });
    setMessage(
      (rolled ? "4d6, en düşüğü atıldı: " : "Standart dizi: ") +
        values.join(" · ") +
        ". İstersen değerleri ve ırk artışlarını elle düzenle.",
    );
  }
  function toggleSpell(target: PlayerSpell) {
    if (!character || !limits) return;
    if (alwaysPrepared.has(target.id)) {
      setMessage(
        "Bu büyü seçtiğin alan veya yeminden gelir; her zaman hazırdır.",
      );
      return;
    }
    if (character.spellbook.includes(target.id)) {
      update((c) => ({
        ...c,
        spellbook: c.spellbook.filter((s) => s !== target.id),
        preparedSpells: c.preparedSpells.filter((s) => s !== target.id),
      }));
      return;
    }
    if (!canSelectSpell(character, target)) {
      setMessage(
        "Bu büyü sınıfın veya seviyen için henüz uygun değil. Katalogda inceleyebilirsin.",
      );
      return;
    }
    const known = spells.filter(
      (s) => character.spellbook.includes(s.id) || alwaysPrepared.has(s.id),
    );
    const nextCounts = spellChoiceCounts(
      { ...character, spellbook: [...character.spellbook, target.id] },
      spells,
    );
    if (nextCounts.cantrips > limits.cantrips) {
      setMessage(
        `Basit büyü sınırın ${limits.cantrips}. Önce başka bir basit büyüyü çıkar.`,
      );
      return;
    }
    if (limits.known !== null && nextCounts.known > limits.known) {
      setMessage(
        `Bilinen büyü sınırın ${limits.known}. Önce başka bir büyüyü çıkar.`,
      );
      return;
    }
    if (
      character.classId === "bard" &&
      nextCounts.secrets > nextCounts.secretsLimit
    ) {
      setMessage(
        `Büyülü Sırlar sınırın ${nextCounts.secretsLimit}. Önce başka bir sır seçimini çıkar.`,
      );
      return;
    }
    if (
      character.classId === "warlock" &&
      target.level >= 6 &&
      known.some((s) => s.level === target.level)
    ) {
      setMessage(
        "Her Gizemli Sır derecesi için tek büyü seçebilirsin. Önce aynı derecedeki seçimini çıkar.",
      );
      return;
    }
    update((c) => ({ ...c, spellbook: [...c.spellbook, target.id] }));
    setMessage(target.name + " defterine eklendi.");
  }
  function togglePrepared(target: PlayerSpell) {
    if (!character || !limits) return;
    if (alwaysPrepared.has(target.id)) {
      setMessage(
        "Bu alan veya yemin büyüsü her zaman hazırdır; normal hazırlık sınırına katılmaz.",
      );
      return;
    }
    if (character.preparedSpells.includes(target.id)) {
      update((c) => ({
        ...c,
        preparedSpells: c.preparedSpells.filter((s) => s !== target.id),
      }));
      return;
    }
    if (!canSelectSpell(character, target) || target.level === 0) return;
    if (
      limits.prepared !== null &&
      character.preparedSpells.filter((id) => !alwaysPrepared.has(id)).length >=
        limits.prepared
    ) {
      setMessage(
        `Hazırlanmış büyü sınırın ${limits.prepared}. Önce başka bir büyünün hazırlığını kaldır.`,
      );
      return;
    }
    update((c) => ({
      ...c,
      spellbook: c.spellbook.includes(target.id)
        ? c.spellbook
        : [...c.spellbook, target.id],
      preparedSpells: [...c.preparedSpells, target.id],
    }));
  }
  function cast(target: PlayerSpell, ritual = false) {
    if (!character || !stats || !limits) return;
    if (
      (!character.spellbook.includes(target.id) &&
        !alwaysPrepared.has(target.id)) ||
      !canSelectSpell(character, target)
    )
      return;
    if (ritual) {
      if (!canRitualCast(character, target)) {
        setMessage("Bu sınıf veya hazırlık için ritüel kullanımı uygun değil.");
        return;
      }
      update({
        concentration: target.concentration
          ? target.id
          : character.concentration,
      });
      setMessage(
        target.name +
          " ritüel olarak uygulandı. Normal kullanım süresine 10 dakika ekle; büyü yuvası harcanmadı. Malzeme koşulları yine geçerli.",
      );
      return;
    }
    if (
      target.level > 0 &&
      limits.prepared !== null &&
      !alwaysPrepared.has(target.id) &&
      !character.preparedSpells.includes(target.id)
    ) {
      setMessage("Önce bu büyüyü hazırla.");
      return;
    }
    try {
      const concentration = target.concentration
        ? target.id
        : character.concentration;
      if (target.level === 0) {
        update({ concentration });
        setMessage(target.name + " kullanıldı. Basit büyüler yuva harcamaz.");
        return;
      }
      if (character.classId === "warlock" && target.level >= 6) {
        update({ ...spendArcanum(character, target.level), concentration });
        setMessage(target.name + " · gizemli sır kullanıldı.");
        return;
      }
      if (character.classId === "warlock") {
        update({ ...spendPactSlot(character), concentration });
        setMessage(
          target.name + ` · ${stats.pact.level}. derece akit yuvası harcandı.`,
        );
        return;
      }
      const grade = spellCastLevel;
      if (grade < target.level)
        throw Error("Büyünün derecesine uygun bir yuva seç.");
      update({ ...spendSpellSlot(character, grade), concentration });
      setMessage(target.name + ` · ${grade}. derece yuva harcandı.`);
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  const known = character
    ? spells.filter(
        (s) => character.spellbook.includes(s.id) || alwaysPrepared.has(s.id),
      )
    : [];
  const missingSpellIds =
    character && spells.length
      ? [
          ...new Set([...character.spellbook, ...character.preparedSpells]),
        ].filter((id) => !spells.some((s) => s.id === id))
      : [];
  const matchingSpells = useMemo(
    () =>
      spells
        .filter(
          (s) =>
            (!character ||
              spellClass === "all" ||
              (onlyBook && character.spellbook.includes(s.id)) ||
              s.classes.includes(
                (spellClass === "character"
                  ? isThirdCaster(character)
                    ? "wizard"
                    : character.classId
                  : spellClass) as ClassId,
              ) ||
              (spellClass === "character" && alwaysPrepared.has(s.id))) &&
            (spellLevel === "all" || s.level === Number(spellLevel)) &&
            (spellSchool === "all" || s.school === spellSchool) &&
            (!onlyEligible || (!!character && canSelectSpell(character, s))) &&
            (!onlyBook ||
              !!character?.spellbook.includes(s.id) ||
              alwaysPrepared.has(s.id)) &&
            normalize(
              s.name + " " + s.englishName + " " + s.description,
            ).includes(normalize(spellQuery)),
        )
        .sort(
          (a, b) => a.level - b.level || a.name.localeCompare(b.name, "tr"),
        ),
    [
      spells,
      character,
      spellClass,
      spellLevel,
      spellSchool,
      onlyEligible,
      onlyBook,
      spellQuery,
    ],
  );
  const stage = tabs.find((t) => t.id === tab)!;
  function goToTab(next: Tab) {
    setTab(next);
    requestAnimationFrame(() => document.querySelector('.pw-tab-' + next)?.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
  function downloadCharacter(c: PlayerCharacter) {
    try {
      DownloadFile({
        name: c.name.replace(/[^\p{L}\p{N}_-]+/gu, "-") + "-Aruzahr.json",
        value: exportPlayerCharacter(c),
      });
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function print() {
    try {
      await printPlayerSheet(character, spells);
    } catch (e) {
      setMessage(
        (e as Error).message ||
          "Yazdırma penceresi açılamadı. Tarayıcıda açılır pencereye izin ver.",
      );
    }
  }

  return (
    <div className="player-workshop" data-testid="player-workshop">
      <PlayerCloud players={players} onRestore={c=>{
        if(loadError)throw Error('Önce yerel kayıt sorununu çöz; eski verin korunuyor.');
        if(players.length>=20)throw Error('Bu cihazda en fazla 20 karakter tutulabilir. Önce yedek indirip yer aç.');
        savePlayers([...players,c]);
        setPlayers([...players,c]);
      }}/>
      {loadError && (
        <section className="pw-alert" role="alert">
          <h2>Kayıt korunuyor</h2>
          <p>{loadError}</p>
          <p>
            Geçerli yedeğini açarsan bu tarayıcıdaki bozuk kayıt yedekten geri
            yüklenir.
          </p>
          <button
            onClick={() => {
              try {
                DownloadFile({
                  name: "Aruzahr-Kurtarilacak-Kayit.json",
                  value: localStorage.getItem(playerStorageKey) || "",
                });
              } catch (e) {
                setMessage(
                  "Tarayıcı bu kayıt alanına erişimi engelliyor. Depolama iznini kontrol et.",
                );
              }
            }}
          >
            Mevcut ham kaydı indir
          </button>
          <button onClick={() => upload.current?.click()}>
            Geçerli karakter yedeğini aç
          </button>
        </section>
      )}
      <input
        ref={upload}
        className="pw-file"
        type="file"
        accept=".json,application/json"
        onChange={(e) => {
          void importFile(e.target.files?.[0]);
          e.target.value = "";
        }}
        aria-label="Karakter JSON dosyası"
      />
      <input
        ref={portraitUpload}
        className="pw-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Karakter portresi dosyası"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file)
            try {
              update({ portrait: await portraitFile(file) });
            } catch (error) {
              setMessage((error as Error).message);
            }
        }}
      />
      {!character ? (
        <>
          <header className="pw-intro">
            <div>
              <span className="pw-eyebrow">
                <Landmark size={14} /> ARUZAHR · OYUNCU DEFTERİ
              </span>
              <h1>
                Bir isimle başlar.
                <br />
                <em>Bir hikâyeye dönüşür.</em>
              </h1>
              <p>
                Yolcunu oluştur. Büyülerini seç, yaralarını ve verdiğin sözleri
                hatırla. Masada yanında olsun diye A4 nüshasını al.
              </p>
              <div className="pw-intro-actions">
                <button
                  className="pw-primary"
                  onClick={() => setModal("create")}
                >
                  <Plus size={17} />
                  Karakter oluştur
                </button>
                <button onClick={() => upload.current?.click()}>
                  <Upload size={16} />
                  Karakter yedeği aç
                </button>
              </div>
            </div>
            <div className="pw-paper-teaser" aria-hidden="true">
              <img className="pw-manuscript-preview" src="/downloads/Aruzahr-Karakter-Kagidi-Onizleme.webp" alt="" width={700} height={990} />
            </div>
          </header>
          <div className="pw-library-tools">
            <div>
              <span className="pw-eyebrow">SENİN YOLCULARIN</span>
              <h2>
                Karakterlerin <small>{players.length}/20</small>
              </h2>
            </div>
            <label>
              <Search size={16} />
              <input
                type="search"
                aria-label="Karakterlerimde ara"
                placeholder="İsim veya sınıf…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          {requested && (
            <p className="pw-alert">
              Bu karakter bu tarayıcıda bulunamadı. Karakter JSON yedeğini
              açarak devam edebilirsin.
            </p>
          )}
          {players.length ? (
            <div className="pw-character-grid">
              {players
                .filter((c) =>
                  normalize(
                    c.name +
                      " " +
                      classDefinitions.find((d) => d.id === c.classId)?.name,
                  ).includes(normalize(search)),
                )
                .map((c) => {
                  const d = classDefinitions.find((d) => d.id === c.classId)!,
                    s = derivedStats(c),
                    house = worldHouses.find((h) => h.id === c.houseId);
                  return (
                    <button
                      className="pw-character-card"
                      key={c.id}
                      onClick={() => navigate("/play/" + c.id)}
                      data-player-id={c.id}
                    >
                      <div className="pw-character-art">
                        {c.portrait ? (
                          <img src={c.portrait} alt="" />
                        ) : house ? (
                          <HeraldicCrest house={house} decorative />
                        ) : (
                          <UserRound size={48} strokeWidth={0.8} />
                        )}
                        <span>
                          {c.level}
                          <small>SEVİYE</small>
                        </span>
                      </div>
                      <div>
                        <small>
                          {d.name} ·{" "}
                          {races.find((r) => r.id === c.raceId)?.name ||
                            "Köken belirsiz"}
                        </small>
                        <h3>{c.name}</h3>
                        <p>{c.origin || "Yolu henüz çizilmedi."}</p>
                        <footer>
                          <span>
                            <Heart size={13} />
                            {c.hp} / {s.maxHp}
                          </span>
                          <span>
                            Defteri aç <ArrowRight size={14} />
                          </span>
                        </footer>
                      </div>
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="pw-empty">
              <BookOpen size={34} strokeWidth={1} />
              <h2>İlk sayfa sana ait.</h2>
              <p>
                Başlangıç seviyesi ve sınıfını seç. Geri kalanını adım adım
                dolduracağız.
              </p>
              <button onClick={() => setModal("create")}>
                İlk karakterimi oluştur <ArrowRight size={15} />
              </button>
            </div>
          )}
          <section className="pw-template-banner">
            <div>
              <Printer size={27} strokeWidth={1} />
              <div>
                <h3>Kâğıt, kalem, bir avuç zar.</h3>
                <p>
                  Boş Aruzahr şablonunu A4 yazdır veya doldurduğun karakterden
                  PDF oluştur.
                </p>
              </div>
            </div>
            <div>
              <a href="/downloads/Aruzahr-Karakter-Kagidi-A4.pdf" download>
                <Download size={15} />
                Boş A4 kâğıdı
              </a>
              <a href="/downloads/Aruzahr-Buyu-Defteri-A4.pdf" download>
                Büyü defteri <ArrowRight size={14} />
              </a>
            </div>
          </section>
          <p className="pw-storage-note">
            <Shield size={14} />
            Karakterlerin bu tarayıcıda otomatik saklanır. Başka cihaza taşımak
            için JSON yedeğini indir. Her oyuncu kendi tarayıcısındaki kaydı
            takip eder.
          </p>
        </>
      ) : (
        <>
          <header className="pw-character-header">
            <button className="pw-back" onClick={() => navigate("/play")}>
              <ArrowLeft size={16} />
              Karakterlerime dön
            </button>
            <div className="pw-character-title">
              <div className="pw-avatar">
                {character.portrait ? (
                  <img src={character.portrait} alt="" />
                ) : selectedHouse ? (
                  <HeraldicCrest house={selectedHouse} decorative />
                ) : (
                  <UserRound size={30} strokeWidth={1} />
                )}
              </div>
              <div>
                <span className="pw-eyebrow">
                  {definition?.name} · {character.level}. SEVİYE · 5E 2014
                </span>
                <h1>{character.name}</h1>
                <p
                  className={
                    saved === "Kayıt yapılamadı" ? "pw-save-error" : ""
                  }
                >
                  <Check size={12} />
                  {saved}
                </p>
              </div>
              <div className="pw-character-actions">
                <button
                  onClick={() => downloadCharacter(character)}
                  title="Karakter JSON yedeğini indir"
                >
                  <Download size={16} />
                  <span>Yedek indir</span>
                </button>
                <button className="pw-primary" onClick={() => void print()}>
                  <Printer size={16} />
                  Yazdır / PDF
                </button>
                <details>
                  <summary aria-label="Diğer karakter işlemleri">
                    <ChevronDown size={17} />
                  </summary>
                  <div>
                    <button onClick={duplicate}>
                      <Copy size={14} />
                      Karakteri çoğalt
                    </button>
                    <button onClick={() => upload.current?.click()}>
                      <Upload size={14} />
                      Yedek aç
                    </button>
                    <button onClick={() => setModal("delete")}>
                      <Trash2 size={14} />
                      Bu karakteri sil
                    </button>
                  </div>
                </details>
              </div>
            </div>
          </header>
          <nav className="pw-tabs" aria-label="Karakter bölümleri">
            {tabs.map((t) => (
              <button
                key={t.id}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => goToTab(t.id)}
              >
                <t.icon size={16} />
                {t.name}
              </button>
            ))}
          </nav>
          <CharacterCreationGuide character={character} spells={spells} onTab={goToTab} onChange={update} />
          <div className="pw-workspace">
            <div className={"pw-main pw-tab-" + tab}>
              {tab === "identity" && (
                <>
                  <CharacterRulesReference character={character} onChange={update} />
                  <Section
                    eyebrow="01 · KİMLİK"
                    title="Bu yolcu kim?"
                    description="Sınıf ve seviye oyun değerlerini hesaplar. Kökeni ve dünyayla bağları sana aittir."
                  >
                    <div className="pw-identity-top">
                      <button
                        className="pw-portrait-edit"
                        onClick={() => portraitUpload.current?.click()}
                      >
                        {character.portrait ? (
                          <img
                            src={character.portrait}
                            alt="Karakter portresi"
                          />
                        ) : (
                          <UserRound size={45} strokeWidth={1} />
                        )}
                        <span>
                          <Upload size={12} />
                          Portre seç
                        </span>
                      </button>
                      <div className="pw-form-grid">
                        <Field label="Karakter adı">
                          <input
                            maxLength={100}
                            value={character.name}
                            onChange={(e) => update({ name: e.target.value })}
                          />
                        </Field>
                        <Field label="Oyuncunun adı">
                          <input
                            maxLength={100}
                            value={character.playerName}
                            onChange={(e) =>
                              update({ playerName: e.target.value })
                            }
                          />
                        </Field>
                        <Field label="Sınıf">
                          <select
                            value={character.classId}
                            onChange={(e) =>
                              update({
                                classId: e.target.value as ClassId,
                                subclass: "",
                              })
                            }
                          >
                            {classDefinitions.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Karakter seviyesi">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={character.level}
                            onChange={(e) =>
                              update({ level: number(e.target.value, 1, 20) })
                            }
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="pw-form-grid">
                      <Field label="Irk / soy">
                        <select
                          value={character.raceId}
                          onChange={(e) => update({ raceId: e.target.value })}
                        >
                          {races.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Geçmiş">
                        <select
                          value={character.backgroundId}
                          onChange={(e) =>
                            update({ backgroundId: e.target.value })
                          }
                        >
                          {backgrounds.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Sınıf yolu / alt sınıf">
                        <select
                          value={character.subclass && !subclasses[character.classId].some(s => s.id === character.subclass) ? 'custom' : character.subclass}
                          onChange={(e) => update({ subclass: e.target.value === 'custom' ? 'Özel sınıf yolu' : e.target.value })}
                        >
                          <option value="">Henüz seçilmedi</option>
                          {(subclasses[character.classId] || []).map((s) => (
                            <option
                              key={s.id}
                              value={s.id}
                              disabled={character.level < s.level}
                            >
                              {s.name} · {s.level}. seviye
                            </option>
                          ))}
                          <option value="custom">Başka kaynak / özel sınıf yolu</option>
                        </select>
                      </Field>
                      {character.subclass && !subclasses[character.classId].some(s => s.id === character.subclass) && <Field label="Özel sınıf yolunun adı"><input maxLength={100} value={character.subclass} onChange={e => update({subclass:e.target.value})} /><small>Yolun koşullarını DM ile doğrula. Özel yolun ek yeteneklerini kaynaklara ve notlara kaydet; yerleşik yol hesapları bu ada otomatik atanmaz.</small></Field>}
                      <Field label="Ahlaki eğilim">
                        <input
                          maxLength={100}
                          value={character.alignment}
                          onChange={(e) =>
                            update({ alignment: e.target.value })
                          }
                          placeholder="Örneğin: Kaotik iyi"
                        />
                      </Field>
                    </div>
                    <p className="pw-inline-note">
                      Sınıf veya seviye değiştirince mevcut büyülerin silinmez;
                      uyumsuz seçimleri Büyüler bölümünde görüp düzenlersin.
                      Soy artışlarını Nitelikler bölümündeki dağıtıcıda açıkça seçerek veya nihai değerleri elle düzenleyerek belirle.
                    </p>
                    <details className="pw-disclosure">
                      <summary>
                        Irk ve geçmiş seçiminde neyi kontrol etmeliyim?
                      </summary>
                      <p>
                        Seçtiğin soyun hız, dil ve özel yeteneklerini;
                        geçmişinin beceri, araç ve dil ustalıklarını kendi kitap
                        kaynağınla birlikte tamamla. Nitelikler bölümündeki
                        değerler son hâlidir; ırk artışını ayrıca sen eklersin.
                        Burada köken seçmek yeni bir hane unvanı vermez.
                      </p>
                      <p>
                        {
                          races.find((r) => r.id === character.raceId)
                            ?.description
                        }
                      </p>
                      <p>
                        {
                          backgrounds.find(
                            (r) => r.id === character.backgroundId,
                          )?.description
                        }
                      </p>
                    </details>
                  </Section>
                  <Section
                    eyebrow="VALHUNAR’LA BAĞI"
                    title="Nereden geliyor?"
                    description="Dünyanın bir yerine tutunmak, oyunda tanıyacağın ilk insanları da belirler."
                  >
                    <div className="pw-form-grid">
                      <Field label="Yerleri ülkeye göre süz">
                        <select
                          value={originRegion}
                          onChange={(e) => setOriginRegion(e.target.value)}
                        >
                          <option value="all">Bütün Valhunar</option>
                          {regions.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Bir yer seç">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value)
                              update({
                                origin:
                                  places.find((p) => p.id === e.target.value)
                                    ?.name || "",
                              });
                          }}
                        >
                          <option value="">Şehirlerden birini seç…</option>
                          {places
                            .filter(
                              (p) =>
                                originRegion === "all" ||
                                p.region === originRegion,
                            )
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </Field>
                      <Field label="Doğduğu yer / köken">
                        <input
                          maxLength={240}
                          value={character.origin}
                          onChange={(e) => update({ origin: e.target.value })}
                          placeholder="Şehir, köy veya kendi hikâyendeki bir yer"
                        />
                      </Field>
                      <Field label="Hane / aidiyet">
                        <select
                          value={character.houseId}
                          onChange={(e) => update({ houseId: e.target.value })}
                        >
                          <option value="">Bağımsız / belirtilmemiş</option>
                          {worldHouses.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Görünüş" wide>
                        <textarea
                          rows={3}
                          maxLength={3000}
                          value={character.appearance}
                          onChange={(e) =>
                            update({ appearance: e.target.value })
                          }
                          placeholder="Bir yara, eski bir palto, dikkat çeken bir bakış…"
                        />
                      </Field>
                    </div>
                    {selectedHouse && (
                      <div className="pw-house">
                        <HeraldicCrest house={selectedHouse} decorative />
                        <div>
                          <strong>{selectedHouse.name}</strong>
                          <p>“{selectedHouse.motto}”</p>
                          <small>
                            {selectedHouse.seatName ||
                              places.find((p) => p.id === selectedHouse.seatId)
                                ?.name}
                          </small>
                        </div>
                      </div>
                    )}
                  </Section>
                  <button
                    className="pw-next-section"
                    onClick={() => setTab("abilities")}
                  >
                    Niteliklerini belirle <ArrowRight size={16} />
                  </button>
                </>
              )}
              {tab === "abilities" && (
                <>
                  <AbilityScoreBuilder character={character} onChange={update} />
                  <Section
                    eyebrow="02 · NİTELİKLER"
                    title="Neye güvenirsin?"
                    description="Altı nihai nitelik değerini yaz. Değiştiriciler, kurtarışlar ve ustalık bonusun birlikte hesaplanır."
                    action={
                      <span className="pw-proficiency">
                        Ustalık <strong>{signed(stats!.proficiency)}</strong>
                      </span>
                    }
                  >
                    <div className="pw-ability-presets">
                      <button onClick={() => setStandard()}>
                        Standart dizi uygula{" "}
                        <small>15 · 14 · 13 · 12 · 10 · 8</small>
                      </button>
                      <button onClick={() => setStandard(true)}>
                        4d6 at, en düşüğü çıkar{" "}
                        <small>Altı değeri sınıf önceliğine dağıt</small>
                      </button>
                    </div>
                    <div className="pw-abilities">
                      {abilityIds.map((a) => (
                        <div key={a}>
                          <span>{abilityAbbr[a]}</span>
                          <strong>{abilityNames[a]}</strong>
                          <input
                            aria-label={abilityNames[a] + " değeri"}
                            type="number"
                            min={1}
                            max={30}
                            value={character.scores[a]}
                            onChange={(e) =>
                              update({
                                scores: {
                                  ...character.scores,
                                  [a]: number(e.target.value, 1, 30),
                                },
                              })
                            }
                          />
                          <button
                            title={abilityNames[a] + " kontrolü at"}
                            onClick={() =>
                              roll(
                                abilityNames[a],
                                abilityModifier(character.scores[a]),
                              )
                            }
                          >
                            {signed(abilityModifier(character.scores[a]))}
                            <small>kontrol at</small>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="pw-inline-note">
                      Bu değerler ırk artışları dahil son değerlerdir. Standart
                      dizi veya zar düğmesi yalnız niteliklerini değiştirir. 27
                      puan yöntemi kullanıyorsan 8–15 aralığındaki başlangıç
                      puanlarını DM’inle doğrula.
                    </p>
                  </Section>
                  <Section
                    title="Kurtarma atışları"
                    description="Sınıfın verdiği ustalıklar işaretli gelir. Ek bir özellik varsa kutusundan ekleyebilirsin."
                  >
                    <div className="pw-saves">
                      {abilityIds.map((a) => {
                        const innate = definition?.saves.includes(a),
                          trained =
                            innate ||
                            character.extraSaveProficiencies.includes(a);
                        return (
                          <div key={a}>
                            <label>
                              <input
                                type="checkbox"
                                checked={trained}
                                disabled={innate}
                                onChange={(e) =>
                                  update({
                                    extraSaveProficiencies: e.target.checked
                                      ? [...character.extraSaveProficiencies, a]
                                      : character.extraSaveProficiencies.filter(
                                          (id) => id !== a,
                                        ),
                                  })
                                }
                              />
                              {abilityNames[a]}
                              {innate && <small>sınıf ustalığı</small>}
                            </label>
                            <button
                              onClick={() =>
                                roll(
                                  abilityNames[a] + " kurtarışı",
                                  savingThrow(character, a),
                                )
                              }
                            >
                              {signed(savingThrow(character, a))}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                  <Section
                    title="Beceriler"
                    description="Ustalık kutusu ustalık bonusunu ekler. Uzmanlık yalnız ustalaştığın bir beceride bu bonusu ikiye katlar."
                  >
                    <div className="pw-skills-heading">
                      <span>BECERİ</span>
                      <span>USTALIK</span>
                      <span>UZMANLIK</span>
                      <span>ATIŞ</span>
                    </div>
                    <div className="pw-skills">
                      {skills.map((skill) => {
                        const trained = character.skillProficiencies.includes(
                          skill.id,
                        );
                        return (
                          <div key={skill.id}>
                            <span>
                              {skill.name}
                              <small>{abilityAbbr[skill.ability]}</small>
                            </span>
                            <input
                              aria-label={skill.name + " ustalığı"}
                              type="checkbox"
                              checked={trained}
                              onChange={(e) =>
                                update({
                                  skillProficiencies: e.target.checked
                                    ? [
                                        ...character.skillProficiencies,
                                        skill.id,
                                      ]
                                    : character.skillProficiencies.filter(
                                        (id) => id !== skill.id,
                                      ),
                                  expertise: e.target.checked
                                    ? character.expertise
                                    : character.expertise.filter(
                                        (id) => id !== skill.id,
                                      ),
                                })
                              }
                            />
                            <input
                              aria-label={skill.name + " uzmanlığı"}
                              type="checkbox"
                              checked={character.expertise.includes(skill.id)}
                              disabled={!trained}
                              onChange={(e) =>
                                update({
                                  expertise: e.target.checked
                                    ? [...character.expertise, skill.id]
                                    : character.expertise.filter(
                                        (id) => id !== skill.id,
                                      ),
                                })
                              }
                            />
                            <button
                              onClick={() =>
                                roll(
                                  skill.name,
                                  skillBonus(character, skill.id),
                                )
                              }
                            >
                              {signed(skillBonus(character, skill.id))}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <p className="pw-inline-note">
                      Sınıf seçimi: {definition?.skillCount} beceri. Sınıfın,
                      geçmişin ve diğer özelliklerin hangi becerileri verdiğini
                      birlikte kontrol et. Kutular toplam ustalıklarını
                      gösterir.
                    </p>
                    <div className="pw-form-grid">
                      <Field label="Diller">
                        <input
                          maxLength={1200}
                          value={character.languages}
                          onChange={(e) =>
                            update({ languages: e.target.value })
                          }
                          placeholder="Ortak dil, cüce dili…"
                        />
                      </Field>
                      <Field label="Araç / alet ustalıkları">
                        <input
                          maxLength={1200}
                          value={character.tools}
                          onChange={(e) => update({ tools: e.target.value })}
                          placeholder="Demirci aletleri, hırsız aletleri…"
                        />
                      </Field>
                    </div>
                  </Section>
                  <button
                    className="pw-next-section"
                    onClick={() => setTab("adventure")}
                  >
                    Maceraya hazırlan <ArrowRight size={16} />
                  </button>
                </>
              )}
              {tab === "adventure" && (
                <>
                  <Section
                    eyebrow="MASADA · CANLI TAKİP"
                    title="Yolun bugün nasıl?"
                    description="Hasar, geçici canı önce tüketir. İyileştirme azami canı aşmaz; bütün değişiklikler bu karaktere kaydolur."
                  >
                    <div className="pw-combat-stats">
                      <div>
                        <Shield size={20} />
                        <small>ZIRH SINIFI</small>
                        <strong>{stats!.armorClass}</strong>
                      </div>
                      <button
                        onClick={() => roll("İnisiyatif", stats!.initiative)}
                      >
                        <Swords size={20} />
                        <small>İNİSİYATİF</small>
                        <strong>{signed(stats!.initiative)}</strong>
                      </button>
                      <div>
                        <ArrowRight size={20} />
                        <small>HIZ</small>
                        <strong>
                          {stats!.speed}
                          <em>fit</em>
                        </strong>
                      </div>
                      <div>
                        <Search size={20} />
                        <small>PASİF ALGI</small>
                        <strong>{stats!.passivePerception}</strong>
                      </div>
                    </div>
                    <div className="pw-hp">
                      <div className="pw-hp-heading">
                        <Heart size={20} />
                        <h3>Can puanları</h3>
                        <span>
                          {character.hp === 0
                            ? "Düşmüş durumda"
                            : character.hp < stats!.maxHp / 2
                              ? "Yaralı"
                              : "Ayakta"}
                        </span>
                      </div>
                      <div className="pw-hp-meter">
                        <i
                          style={{
                            width:
                              Math.min(
                                100,
                                (character.hp / stats!.maxHp) * 100,
                              ) + "%",
                          }}
                        />
                      </div>
                      <div className="pw-hp-fields">
                        <Field label="Mevcut can">
                          <input
                            aria-label="Mevcut can"
                            type="number"
                            min={0}
                            max={9999}
                            value={character.hp}
                            onChange={(e) =>
                              update({ hp: number(e.target.value, 0, 9999) })
                            }
                          />
                        </Field>
                        <div>
                          <small>AZAMİ CAN</small>
                          <strong>{stats!.maxHp}</strong>
                        </div>
                        <Field label="Geçici can">
                          <input
                            type="number"
                            min={0}
                            max={9999}
                            value={character.tempHp}
                            onChange={(e) =>
                              update({
                                tempHp: number(e.target.value, 0, 9999),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <div className="pw-hp-actions">
                        <Field label="Miktar">
                          <input
                            aria-label="Can değiştirme miktarı"
                            type="number"
                            min={1}
                            max={9999}
                            value={damage}
                            onChange={(e) =>
                              setDamage(number(e.target.value, 1, 9999))
                            }
                          />
                        </Field>
                        <button
                          className="pw-damage"
                          onClick={() => changeHp(false)}
                        >
                          − {damage} hasar
                        </button>
                        <button onClick={() => changeHp(true)}>
                          + {damage} iyileştir
                        </button>
                      </div>
                    </div>
                    <div className="pw-form-grid">
                      <label className="pw-check">
                        <input
                          type="checkbox"
                          checked={character.inspiration}
                          onChange={(e) =>
                            update({ inspiration: e.target.checked })
                          }
                        />
                        <Sparkles size={15} />
                        İlhamım var
                      </label>
                      <Field label="Bitkinlik seviyesi">
                        <input
                          type="number"
                          min={0}
                          max={6}
                          value={character.exhaustion}
                          onChange={(e) =>
                            update({ exhaustion: number(e.target.value, 0, 6) })
                          }
                        />
                      </Field>
                    </div>
                    <details
                      className="pw-disclosure"
                      open={character.hp === 0}
                    >
                      <summary>Ölüm kurtarışları</summary>
                      <p>
                        0 can puanındayken masanın kararına göre takip et. Bu
                        kutular kendiliğinden karakterini silmez.
                      </p>
                      <div className="pw-death">
                        <div>
                          <span>Başarı</span>
                          {[1, 2, 3].map((n) => (
                            <button
                              key={n}
                              aria-label={n + ". ölüm kurtarışı başarısı"}
                              aria-pressed={character.deathSuccesses >= n}
                              onClick={() =>
                                update({
                                  deathSuccesses:
                                    character.deathSuccesses === n ? n - 1 : n,
                                })
                              }
                            >
                              ○
                            </button>
                          ))}
                        </div>
                        <div>
                          <span>Başarısızlık</span>
                          {[1, 2, 3].map((n) => (
                            <button
                              key={n}
                              aria-label={n + ". ölüm kurtarışı başarısızlığı"}
                              aria-pressed={character.deathFailures >= n}
                              onClick={() =>
                                update({
                                  deathFailures:
                                    character.deathFailures === n ? n - 1 : n,
                                })
                              }
                            >
                              ○
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            const result = die(20);
                            setRollMessage(
                              "Ölüm kurtarışı: d20 = " +
                                result +
                                ". Sonucu masanın kurallarına göre işle.",
                            );
                          }}
                        >
                          d20 at
                        </button>
                        <button
                          onClick={() =>
                            update({ deathSuccesses: 0, deathFailures: 0 })
                          }
                        >
                          Kutuları temizle
                        </button>
                      </div>
                    </details>
                  </Section>
                  <Section
                    title="Saldırılar"
                    description="Silahını ve hasar ifadesini yaz. İsabet, seçtiğin nitelik ve ustalık üzerinden hesaplanır."
                    action={
                      <button
                        onClick={() =>
                          update({
                            attacks: [
                              ...character.attacks,
                              {
                                id: id(),
                                name: "Yeni saldırı",
                                ability: "str",
                                proficient: true,
                                damage: "1d6",
                                damageType: "Kesici",
                                notes: "",
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={15} />
                        Saldırı ekle
                      </button>
                    }
                  >
                    <div className="pw-attacks">
                      {!character.attacks.length && (
                        <p className="pw-muted">
                          Henüz saldırı yok. Kılıç, yay veya özel bir eylem
                          ekleyebilirsin.
                        </p>
                      )}
                      {character.attacks.map((attack) => {
                        const bonus =
                          abilityModifier(character.scores[attack.ability]) +
                          (attack.proficient ? stats!.proficiency : 0);
                        return (
                          <article key={attack.id}>
                            <div className="pw-row-heading">
                              <input
                                aria-label="Saldırı adı"
                                value={attack.name}
                                maxLength={120}
                                onChange={(e) =>
                                  update({
                                    attacks: character.attacks.map((a) =>
                                      a.id === attack.id
                                        ? { ...a, name: e.target.value }
                                        : a,
                                    ),
                                  })
                                }
                              />
                              <button
                                onClick={() =>
                                  roll(attack.name + " isabet", bonus)
                                }
                              >
                                {signed(bonus)} <small>isabet at</small>
                              </button>
                              <button
                                aria-label={attack.name + " saldırısını kaldır"}
                                onClick={() =>
                                  update({
                                    attacks: character.attacks.filter(
                                      (a) => a.id !== attack.id,
                                    ),
                                  })
                                }
                              >
                                <X size={15} />
                              </button>
                            </div>
                            <div className="pw-form-grid pw-form-four">
                              <Field label="Nitelik">
                                <select
                                  value={attack.ability}
                                  onChange={(e) =>
                                    update({
                                      attacks: character.attacks.map((a) =>
                                        a.id === attack.id
                                          ? {
                                              ...a,
                                              ability: e.target
                                                .value as AbilityId,
                                            }
                                          : a,
                                      ),
                                    })
                                  }
                                >
                                  {abilityIds.map((a) => (
                                    <option key={a} value={a}>
                                      {abilityNames[a]}
                                    </option>
                                  ))}
                                </select>
                              </Field>
                              <Field label="Hasar">
                                <input
                                  value={attack.damage}
                                  maxLength={80}
                                  onChange={(e) =>
                                    update({
                                      attacks: character.attacks.map((a) =>
                                        a.id === attack.id
                                          ? { ...a, damage: e.target.value }
                                          : a,
                                      ),
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Hasar türü">
                                <input
                                  value={attack.damageType}
                                  maxLength={100}
                                  onChange={(e) =>
                                    update({
                                      attacks: character.attacks.map((a) =>
                                        a.id === attack.id
                                          ? { ...a, damageType: e.target.value }
                                          : a,
                                      ),
                                    })
                                  }
                                />
                              </Field>
                              <label className="pw-check">
                                <input
                                  type="checkbox"
                                  checked={attack.proficient}
                                  onChange={(e) =>
                                    update({
                                      attacks: character.attacks.map((a) =>
                                        a.id === attack.id
                                          ? {
                                              ...a,
                                              proficient: e.target.checked,
                                            }
                                          : a,
                                      ),
                                    })
                                  }
                                />
                                Ustalığım var
                              </label>
                            </div>
                            <Field label="Saldırı notu">
                              <input
                                maxLength={1000}
                                value={attack.notes}
                                onChange={(e) =>
                                  update({
                                    attacks: character.attacks.map((a) =>
                                      a.id === attack.id
                                        ? { ...a, notes: e.target.value }
                                        : a,
                                    ),
                                  })
                                }
                                placeholder="Menzil, iki elli, becerikli…"
                              />
                            </Field>
                          </article>
                        );
                      })}
                    </div>
                  </Section>
                  <Section
                    title="Dinlenme ve kaynaklar"
                    description="Kısa dinlenme kendi başına can doldurmaz; harcadığın can zarı kadar iyileşirsin."
                  >
                    <div className="pw-rest-actions">
                      <button onClick={() => setModal("short-rest")}>
                        <Moon size={16} />
                        Kısa dinlenme
                      </button>
                      <button
                        onClick={() => {
                          setRestSupplies(false);
                          setModal("long-rest");
                        }}
                      >
                        <Moon size={16} />
                        Uzun dinlenme
                      </button>
                      <span>
                        Can zarı:{" "}
                        <strong>
                          {character.level - character.hitDiceUsed} /{" "}
                          {character.level} d{definition?.hitDie}
                        </strong>
                      </span>
                    </div>
                    <button
                      className="pw-hit-die"
                      disabled={character.hitDiceUsed >= character.level}
                      onClick={() => {
                        const value = die(definition!.hitDie);
                        try {
                          update(useHitDie(character, value));
                          setRollMessage(
                            `Can zarı d${definition!.hitDie}: ${value} ${signed(abilityModifier(character.scores.con))} Dayanıklılık.`,
                          );
                        } catch (e) {
                          setMessage((e as Error).message);
                        }
                      }}
                    >
                      Bir can zarı harca ve iyileş
                    </button>
                    <div className="pw-resource-list">
                      {character.resources.map((resource) => (
                        <article key={resource.id}>
                          <strong>{resource.name}</strong>
                          {resource.description&&<details className="pw-resource-description"><summary>Nasıl kullanılır?</summary><p>{resource.description}</p></details>}
                          <span>
                            {Math.max(0, resource.max - resource.used)} /{" "}
                            {resource.max}
                          </span>
                          <button
                            aria-label={resource.name + " kullan"}
                            disabled={resource.used >= resource.max}
                            onClick={() =>
                              update({
                                resources: character.resources.map((r) =>
                                  r.id === resource.id
                                    ? {
                                        ...r,
                                        used: Math.min(r.max, r.used + 1),
                                      }
                                    : r,
                                ),
                              })
                            }
                          >
                            Kullan
                          </button>
                          <button
                            aria-label={resource.name + " geri koy"}
                            disabled={resource.used === 0}
                            onClick={() =>
                              update({
                                resources: character.resources.map((r) =>
                                  r.id === resource.id
                                    ? { ...r, used: Math.max(0, r.used - 1) }
                                    : r,
                                ),
                              })
                            }
                          >
                            Geri koy
                          </button>
                        </article>
                      ))}
                    </div>
                    <details className="pw-disclosure">
                      <summary>Kendi özellik sayacını ekle / düzenle</summary>
                      <p>
                        Öfke, Ki, İkinci Nefes veya kullandığın başka bir
                        yeteneği masanın belirlediği sayıyla takip edebilirsin.
                      </p>
                      {character.resources.map((resource) => (
                        <div className="pw-resource-edit" key={resource.id}>
                          <input
                            aria-label="Kaynak adı"
                            value={resource.name}
                            maxLength={100}
                            onChange={(e) =>
                              update({
                                resources: character.resources.map((r) =>
                                  r.id === resource.id
                                    ? { ...r, name: e.target.value }
                                    : r,
                                ),
                              })
                            }
                          />
                          <input
                            aria-label={resource.name + " azami kullanımı"}
                            type="number"
                            min={0}
                            max={99}
                            value={resource.max}
                            onChange={(e) =>
                              update({
                                resources: character.resources.map((r) =>
                                  r.id === resource.id
                                    ? {
                                        ...r,
                                        max: number(e.target.value, 0, 99),
                                        used: Math.min(
                                          r.used,
                                          number(e.target.value, 0, 99),
                                        ),
                                      }
                                    : r,
                                ),
                              })
                            }
                          />
                          <select
                            aria-label={resource.name + " yenilenmesi"}
                            value={resource.reset}
                            onChange={(e) =>
                              update({
                                resources: character.resources.map((r) =>
                                  r.id === resource.id
                                    ? {
                                        ...r,
                                        reset: e.target.value as
                                          | "short"
                                          | "long"
                                          | "manual",
                                      }
                                    : r,
                                ),
                              })
                            }
                          >
                            <option value="short">Kısa dinlenme</option>
                            <option value="long">Uzun dinlenme</option>
                            <option value="manual">Elle</option>
                          </select>
                          <button
                            aria-label={resource.name + " sayacını kaldır"}
                            onClick={() =>
                              update({
                                resources: character.resources.filter(
                                  (r) => r.id !== resource.id,
                                ),
                              })
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          update({
                            resources: [
                              ...character.resources,
                              {
                                id: id(),
                                name: "Yeni özellik",
                                max: 1,
                                used: 0,
                                reset: "long",
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={14} />
                        Sayaç ekle
                      </button>
                    </details>
                  </Section>
                  <Section title="Savunma ve durumlar">
                    <div className="pw-form-grid">
                      <Field label="Kuşanılan zırh">
                        <select
                          value={character.armorId}
                          onChange={(e) => update({ armorId: e.target.value })}
                        >
                          {armorDefinitions.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <label className="pw-check">
                        <input
                          type="checkbox"
                          checked={character.shield}
                          onChange={(e) => update({ shield: e.target.checked })}
                        />
                        Kalkan kullanıyorum · +2 ZS
                      </label>
                      <Field label="Ek zırh bonusu">
                        <input
                          type="number"
                          min={-10}
                          max={20}
                          value={character.acBonus}
                          onChange={(e) =>
                            update({ acBonus: number(e.target.value, -10, 20) })
                          }
                        />
                      </Field>
                      <Field label="Ek inisiyatif bonusu">
                        <input
                          type="number"
                          min={-10}
                          max={20}
                          value={character.initiativeBonus}
                          onChange={(e) =>
                            update({
                              initiativeBonus: number(e.target.value, -10, 20),
                            })
                          }
                        />
                      </Field>
                      <Field
                        label="Temel azami canı elle belirle"
                        hint="Boş bırakırsan sınıf, seviye ve Dayanıklılıkla hesaplanır."
                      >
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={character.maxHpOverride ?? ""}
                          placeholder={String(stats!.maxHp)}
                          onChange={(e) =>
                            update({
                              maxHpOverride:
                                e.target.value === ""
                                  ? null
                                  : number(e.target.value, 1, 9999),
                            })
                          }
                        />
                      </Field>
                      <Field label="Hızı elle belirle · fit">
                        <input
                          type="number"
                          min={0}
                          max={1000}
                          value={character.speedOverride ?? ""}
                          placeholder={String(stats!.speed)}
                          onChange={(e) =>
                            update({
                              speedOverride:
                                e.target.value === ""
                                  ? null
                                  : number(e.target.value, 0, 1000),
                            })
                          }
                        />
                      </Field>
                    </div>
                    <div className="pw-conditions">
                      {conditionNames.map((condition) => (
                        <button
                          key={condition}
                          aria-pressed={character.conditions.includes(
                            condition,
                          )}
                          onClick={() =>
                            update({
                              conditions: character.conditions.includes(
                                condition,
                              )
                                ? character.conditions.filter(
                                    (c) => c !== condition,
                                  )
                                : [...character.conditions, condition],
                            })
                          }
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  </Section>
                </>
              )}
              {tab === "spells" && (
                <>
                  <SpellArchiveTools spells={spells} classId={character.classId} onMessage={setMessage} onRefresh={() => { void loadPlayerSpells().then(next => { setSpells(next); setSpellError("") }).catch(e => setSpellError((e as Error).message)) }} />
                  <Section
                    eyebrow="04 · BÜYÜ DEFTERİ"
                    title="Söz, işaret ve irade."
                    description={
                      limits!.mode === "none"
                        ? "Bu sınıfın şu seviyede büyü kullanımı yok. Kataloğu inceleyebilir; büyü kazandıran uygun bir sınıf yolu seçince defterini doldurabilirsin."
                        : `${character.level}. seviye ${definition?.name}, şu anda ${limits!.maxLevel}. dereceye kadar sınıf büyüsü seçebilir. Karakter seviyesi ile büyü derecesi ayrı ilerler.`
                    }
                  >
                    <div className="pw-spell-summary">
                      <div>
                        <span>BÜYÜ DC</span>
                        <strong>{stats!.spellDC || "—"}</strong>
                      </div>
                      <div>
                        <span>BÜYÜ İSABETİ</span>
                        <strong>
                          {stats!.spellAbility
                            ? signed(stats!.spellAttack ?? 0)
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        <span>BASİT BÜYÜ</span>
                        <strong>
                          {known.filter((s) => s.level === 0).length}
                          <small> / {limits!.cantrips}</small>
                        </strong>
                      </div>
                      <div>
                        <span>
                          {limits!.prepared !== null
                            ? "HAZIR BÜYÜ"
                            : "BİLİNEN BÜYÜ"}
                        </span>
                        <strong>
                          {limits!.prepared !== null
                            ? character.preparedSpells.filter(
                                (id) => !alwaysPrepared.has(id),
                              ).length
                            : known.filter(
                                (s) =>
                                  s.level > 0 &&
                                  (character.classId !== "warlock" ||
                                    s.level <= 5),
                              ).length}
                          <small>
                            {limits!.prepared !== null
                              ? " / " + limits!.prepared
                              : limits!.known !== null
                                ? " / " + limits!.known
                                : ""}
                          </small>
                        </strong>
                      </div>
                    </div>
                    {character.classId === "wizard" && (
                      <p className="pw-inline-note">
                        Büyü kitabına öğrendiğin büyüleri ekle; o gün
                        kullanacaklarını ayrıca hazırla. Kitaba eklemek altın,
                        zaman ve hikâyede öğrenme koşullarını kendiliğinden
                        sağlamaz. Ritüel büyülerinin kitapta olması ayrı bir
                        kullanım sağlayabilir.
                      </p>
                    )}
                    {missingSpellIds.length > 0 && (
                      <details className="pw-disclosure">
                        <summary>
                          Arşivde bulunamayan {missingSpellIds.length} seçim
                        </summary>
                        <p>
                          Bu kimlikler kayıtlarında korunuyor. İlgili özel büyü
                          dosyasını yeniden açabilir veya kullanmadığın seçimi
                          kaldırabilirsin.
                        </p>
                        {missingSpellIds.map((id) => (
                          <div className="pw-missing-spell" key={id}>
                            <code>{id}</code>
                            <button
                              onClick={() =>
                                update((c) => ({
                                  ...c,
                                  spellbook: c.spellbook.filter(
                                    (v) => v !== id,
                                  ),
                                  preparedSpells: c.preparedSpells.filter(
                                    (v) => v !== id,
                                  ),
                                }))
                              }
                            >
                              Bu seçimi kaldır
                            </button>
                          </div>
                        ))}
                      </details>
                    )}
                    {!!stats!.slots.some(Boolean) && (
                      <div
                        className="pw-slot-tracker"
                        aria-label="Büyü yuvaları"
                      >
                        {stats!.slots.map(
                          (total, index) =>
                            total > 0 && (
                              <div key={index}>
                                <span>
                                  {index + 1}. derece
                                  <small>
                                    {Math.max(
                                      0,
                                      total -
                                        (character.usedSpellSlots[index] || 0),
                                    )}{" "}
                                    / {total} boş
                                  </small>
                                </span>
                                <div>
                                  {Array.from({ length: total }, (_, n) => (
                                    <button
                                      key={n}
                                      aria-label={`${index + 1}. derece ${n + 1}. büyü yuvası`}
                                      aria-pressed={
                                        n <
                                        (character.usedSpellSlots[index] || 0)
                                      }
                                      onClick={() =>
                                        update((c) => {
                                          const used = [...c.usedSpellSlots];
                                          used[index] =
                                            (used[index] || 0) === n + 1
                                              ? n
                                              : n + 1;
                                          return { ...c, usedSpellSlots: used };
                                        })
                                      }
                                    >
                                      {n <
                                      (character.usedSpellSlots[index] || 0)
                                        ? "◆"
                                        : "◇"}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ),
                        )}
                      </div>
                    )}
                    {stats!.pact.slots > 0 && (
                      <div className="pw-pact">
                        <div>
                          <strong>
                            Akit büyüsü · {stats!.pact.level}. derece
                          </strong>
                          <p>Kısa dinlenmede yenilenen ayrı akit yuvaları.</p>
                        </div>
                        <div>
                          {Array.from({ length: stats!.pact.slots }, (_, n) => (
                            <button
                              aria-label={n + 1 + ". akit yuvası"}
                              aria-pressed={n < character.pactSlotsUsed}
                              key={n}
                              onClick={() =>
                                update({
                                  pactSlotsUsed:
                                    character.pactSlotsUsed === n + 1
                                      ? n
                                      : n + 1,
                                })
                              }
                            >
                              {n < character.pactSlotsUsed ? "◆" : "◇"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {limits!.arcanumLevels.length > 0 && (
                      <div className="pw-arcanum">
                        <strong>Gizemli sırlar</strong>
                        <p>
                          Her derece için uzun dinlenmede yenilenen ayrı bir
                          kullanım.
                        </p>
                        {limits!.arcanumLevels.map((level) => (
                          <button
                            key={level}
                            aria-pressed={character.arcanumUsed?.includes(
                              level,
                            )}
                            onClick={() =>
                              update({
                                arcanumUsed: character.arcanumUsed?.includes(
                                  level,
                                )
                                  ? character.arcanumUsed.filter(
                                      (v) => v !== level,
                                    )
                                  : [...(character.arcanumUsed || []), level],
                              })
                            }
                          >
                            {level}. derece ·{" "}
                            {character.arcanumUsed?.includes(level)
                              ? "kullanıldı"
                              : "hazır"}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="pw-concentration">
                      <span>YOĞUNLAŞMA</span>
                      <strong>
                        {spells.find((s) => s.id === character.concentration)
                          ?.name ||
                          character.concentration ||
                          "Bir büyüye yoğunlaşmıyorsun."}
                      </strong>
                      {character.concentration && (
                        <button onClick={() => update({ concentration: "" })}>
                          Yoğunlaşmayı bitir <X size={13} />
                        </button>
                      )}
                    </div>
                  </Section>
                  <Section
                    title="Büyü arşivi"
                    description="Bütün dereceleri inceleyebilirsin. Seçim düğmeleri sınıfına ve seviyene göre açılır; yüksek dereceli bir büyüyü görmek onu kullanabildiğin anlamına gelmez."
                  >
                    <StartingSpells character={character} spells={spells} onChange={update} />
                    <div className="pw-spell-search">
                      <Search size={17} />
                      <input
                        type="search"
                        aria-label="Türkçe veya İngilizce büyü ara"
                        value={spellQuery}
                        onChange={(e) => setSpellQuery(e.target.value)}
                        placeholder="Büyü adı veya etkisi…"
                      />
                    </div>
                    <div className="pw-archive-shortcuts" aria-label="Büyü arşivi hızlı görünüm">
                      <button onClick={() => { setSpellClass("character"); setSpellLevel("all"); setOnlyBook(false); setOnlyEligible(true); setSpellSchool("all"); setSpellQuery("") }}>Sınıfıma uygun seçimler</button>
                      <button onClick={() => { setSpellClass("character"); setSpellLevel("0"); setOnlyBook(false); setOnlyEligible(false); setSpellSchool("all"); setSpellQuery("") }}>Basit büyüleri bul</button>
                      <button onClick={() => { setSpellClass("all"); setSpellLevel("all"); setOnlyBook(false); setOnlyEligible(false); setSpellSchool("all"); setSpellQuery("") }}>Tüm arşivi incele · {spells.length}</button>
                    </div>
                    <div className="pw-spell-filters">
                      <Field label="Büyü sınıfı">
                        <select
                          value={spellClass}
                          onChange={(e) => setSpellClass(e.target.value)}
                        >
                          <option value="character">
                            Kendi sınıfım · {definition?.name}
                          </option>
                          <option value="all">Bütün sınıflar</option>
                          {classDefinitions
                            .filter((c) =>
                              [
                                "bard",
                                "cleric",
                                "druid",
                                "paladin",
                                "ranger",
                                "sorcerer",
                                "warlock",
                                "wizard",
                              ].includes(c.id),
                            )
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </Field>
                      <Field label="Büyü derecesi">
                        <select
                          value={spellLevel}
                          onChange={(e) => setSpellLevel(e.target.value)}
                        >
                          <option value="all">Bütün dereceler</option>
                          <option value="0">Basit büyüler · derece 0</option>
                          {Array.from({ length: 9 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}. derece
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Büyü okulu">
                        <select
                          value={spellSchool}
                          onChange={(e) => setSpellSchool(e.target.value)}
                        >
                          <option value="all">Bütün okullar</option>
                          {[...new Set(spells.map((s) => s.school))]
                            .sort()
                            .map((s) => (
                              <option key={s} value={s}>
                                {schools[s] || s}
                              </option>
                            ))}
                        </select>
                      </Field>
                    </div>
                    <div className="pw-spell-view">
                      <button
                        aria-pressed={onlyBook}
                        onClick={() => setOnlyBook((v) => !v)}
                      >
                        <BookOpen size={14} />
                        Yalnız defterim · {known.length}
                      </button>
                      <button
                        aria-pressed={onlyEligible}
                        onClick={() => setOnlyEligible((v) => !v)}
                      >
                        <Check size={14} />
                        Seçebildiklerim
                      </button>
                      <span>
                        {matchingSpells.length} / {spells.length} büyü
                      </span>
                    </div>
                    {spellError ? (
                      <div role="alert" className="pw-alert">
                        <p>{spellError}</p>
                        <button
                          onClick={() => {
                            void loadPlayerSpells()
                              .then((next) => {
                                setSpells(next);
                                setSpellError("");
                              })
                              .catch((e) => setSpellError(e.message));
                          }}
                        >
                          Arşivi yeniden aç
                        </button>
                        {localStorage.getItem(customSpellStorageKey) && (
                          <>
                            <button
                              onClick={() =>
                                DownloadFile({
                                  name: "Aruzahr-Ozel-Buyuler-Ham-Kayit.json",
                                  value:
                                    localStorage.getItem(
                                      customSpellStorageKey,
                                    ) || "",
                                })
                              }
                            >
                              Özel büyü ham kaydını indir
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Yalnız özel büyü arşivi bu tarayıcıdan kaldırılsın mı? Önce ham yedeği indirebilirsin. Karakterlerin ve büyü seçimlerinin kimlikleri korunur.",
                                  )
                                ) {
                                  localStorage.removeItem(
                                    customSpellStorageKey,
                                  );
                                  void loadPlayerSpells()
                                    .then((next) => {
                                      setSpells(next);
                                      setSpellError("");
                                      setMessage(
                                        "Özel büyü kaydı temizlendi. Yerleşik 319 büyü açıldı; karakter kayıtların korundu.",
                                      );
                                    })
                                    .catch((e) => setSpellError(e.message));
                                }
                              }}
                            >
                              Özel büyü kaydını temizle
                            </button>
                          </>
                        )}
                      </div>
                    ) : !spells.length ? (
                      <p role="status">Türkçe büyü arşivi açılıyor…</p>
                    ) : (
                      <div className="pw-spell-grid">
                        {matchingSpells.slice(0, spellLimit).map((s) => {
                          const eligible = canSelectSpell(character, s),
                            inBook =
                              character.spellbook.includes(s.id) ||
                              alwaysPrepared.has(s.id),
                            prepared =
                              character.preparedSpells.includes(s.id) ||
                              alwaysPrepared.has(s.id);
                          return (
                            <article
                              className={
                                "pw-spell-card" +
                                (inBook ? " in-book" : "") +
                                (!eligible ? " unavailable" : "")
                              }
                              key={s.id}
                              data-spell-id={s.id}
                            >
                              <button
                                className="pw-spell-open"
                                onClick={() => {
                                  setSelectedSpell(s.id);
                                  const free = stats!.slots.findIndex(
                                    (total, index) =>
                                      index + 1 >= Math.max(1, s.level) &&
                                      total >
                                        (character.usedSpellSlots[index] || 0),
                                  );
                                  setSpellCastLevel(
                                    free >= 0 ? free + 1 : Math.max(1, s.level),
                                  );
                                }}
                              >
                                <span>
                                  {s.level === 0
                                    ? "BASİT BÜYÜ"
                                    : s.level + ". DERECE"}
                                  <small>{schools[s.school] || s.school}</small>
                                </span>
                                <h3>{s.name}</h3>
                                <p>
                                  {s.description.slice(0, 150)}
                                  {s.description.length > 150 ? "…" : ""}
                                </p>
                                <div>
                                  {s.concentration && <small>Yoğunlaşma</small>}
                                  {s.ritual && <small>Ritüel</small>}
                                  <small>{s.castingTime}</small>
                                </div>
                              </button>
                              <footer>
                                <button
                                  className={inBook ? "selected" : ""}
                                  aria-label={
                                    s.name +
                                    (inBook
                                      ? " defterden çıkar"
                                      : " deftere ekle")
                                  }
                                  disabled={
                                    alwaysPrepared.has(s.id) ||
                                    (!eligible && !inBook)
                                  }
                                  onClick={() => toggleSpell(s)}
                                >
                                  {inBook ? (
                                    <Check size={13} />
                                  ) : (
                                    <Plus size={13} />
                                  )}{" "}
                                  {alwaysPrepared.has(s.id)
                                    ? "Her zaman hazır"
                                    : inBook
                                      ? "Defterimde"
                                      : eligible
                                        ? "Deftere ekle"
                                        : s.classes.includes(character.classId)
                                          ? "Seviyen yetmiyor"
                                          : "Başka sınıf"}
                                </button>
                                {eligible &&
                                  !alwaysPrepared.has(s.id) &&
                                  s.level > 0 &&
                                  limits!.prepared !== null && (
                                    <button
                                      aria-label={
                                        s.name +
                                        (prepared
                                          ? " hazırlığını kaldır"
                                          : " hazırla")
                                      }
                                      aria-pressed={prepared}
                                      onClick={() => togglePrepared(s)}
                                    >
                                      {prepared ? "Hazır" : "Hazırla"}
                                    </button>
                                  )}
                              </footer>
                            </article>
                          );
                        })}
                      </div>
                    )}
                    {!matchingSpells.length && !!spells.length && (
                      <p className="pw-muted">
                        Bu filtrelerle büyü bulunamadı. Sınıfı, dereceyi veya
                        arama metnini değiştirebilirsin.
                      </p>
                    )}
                    {matchingSpells.length > spellLimit && (
                      <button
                        className="pw-load-more"
                        onClick={() => setSpellLimit((v) => v + 30)}
                      >
                        Sonraki{" "}
                        {Math.min(30, matchingSpells.length - spellLimit)}{" "}
                        büyüyü göster <ArrowRight size={14} />
                      </button>
                    )}
                    <p className="pw-source">
                      Arşiv, D&D 5e 2014’ün açık SRD 5.1 büyülerini içerir.
                      Türkçe karşılıklar oyun için hazırlanmıştır. Kaynak ve
                      lisans bilgisi büyü ayrıntısındadır.
                    </p>
                  </Section>
                </>
              )}
              {tab === "equipment" && (
                <>
                  <EquipmentCatalog character={character} onChange={update} onMessage={setMessage} />
                  <Section
                    eyebrow="05 · YÜK VE EMEK"
                    title="Yanında ne var?"
                    description="Birim ağırlığı libre (lb), miktarı adet olarak yaz. Toplam yalnız aşağıdaki eşya kayıtlarını toplar."
                    action={
                      <button
                        onClick={() =>
                          update({
                            equipment: [
                              ...character.equipment,
                              {
                                id: id(),
                                name: "Yeni eşya",
                                quantity: 1,
                                weight: 0,
                                notes: "",
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={15} />
                        Eşya ekle
                      </button>
                    }
                  >
                    <div className="pw-inventory-total">
                      <Backpack size={21} />
                      <span>Taşınan eşya ağırlığı</span>
                      <strong>
                        {character.equipment
                          .reduce(
                            (sum, item) => sum + item.quantity * item.weight,
                            0,
                          )
                          .toLocaleString("tr", {
                            maximumFractionDigits: 2,
                          })}{" "}
                        <small>lb</small>
                      </strong>
                    </div>
                    {!character.equipment.length && (
                      <p className="pw-muted">
                        Çantan henüz boş. Silah, zırh, erzak ve macera
                        eşyalarını buraya ekle.
                      </p>
                    )}
                    <div className="pw-equipment-list">
                      {character.equipment.map((item) => (
                        <article key={item.id}>
                          <div className="pw-row-heading">
                            <input
                              aria-label="Eşya adı"
                              maxLength={120}
                              value={item.name}
                              onChange={(e) =>
                                update({
                                  equipment: character.equipment.map((i) =>
                                    i.id === item.id
                                      ? { ...i, name: e.target.value }
                                      : i,
                                  ),
                                })
                              }
                            />
                            <button
                              aria-label={item.name + " eşyasını sil"}
                              onClick={() =>
                                update({
                                  equipment: character.equipment.filter(
                                    (i) => i.id !== item.id,
                                  ),
                                })
                              }
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="pw-form-grid pw-form-three">
                            <Field label="Adet">
                              <input
                                type="number"
                                min={0}
                                max={9999}
                                value={item.quantity}
                                onChange={(e) =>
                                  update({
                                    equipment: character.equipment.map((i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            quantity: number(
                                              e.target.value,
                                              0,
                                              9999,
                                            ),
                                          }
                                        : i,
                                    ),
                                  })
                                }
                              />
                            </Field>
                            <Field label="Birim ağırlık · lb">
                              <input
                                type="number"
                                min={0}
                                max={99999}
                                step=".1"
                                value={item.weight}
                                onChange={(e) =>
                                  update({
                                    equipment: character.equipment.map((i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            weight: clamp(
                                              Number(e.target.value),
                                              0,
                                              99999,
                                            ),
                                          }
                                        : i,
                                    ),
                                  })
                                }
                              />
                            </Field>
                            <Field label="Not">
                              <input
                                maxLength={1200}
                                value={item.notes}
                                onChange={(e) =>
                                  update({
                                    equipment: character.equipment.map((i) =>
                                      i.id === item.id
                                        ? { ...i, notes: e.target.value }
                                        : i,
                                    ),
                                  })
                                }
                                placeholder="Kimin emaneti, kaç kullanımlık…"
                              />
                            </Field>
                          </div>
                        </article>
                      ))}
                    </div>
                  </Section>
                  <Section title="Kesendekiler">
                    <div className="pw-coins">
                      {(
                        [
                          ["cp", "Bakır"],
                          ["sp", "Gümüş"],
                          ["ep", "Elektron"],
                          ["gp", "Altın"],
                          ["pp", "Platin"],
                        ] as const
                      ).map(([key, name]) => (
                        <Field key={key} label={name}>
                          <input
                            type="number"
                            min={0}
                            max={9999999}
                            value={character.coins[key]}
                            onChange={(e) =>
                              update({
                                coins: {
                                  ...character.coins,
                                  [key]: number(e.target.value, 0, 9999999),
                                },
                              })
                            }
                          />
                        </Field>
                      ))}
                    </div>
                    <p className="pw-inline-note">
                      Madeni paralar kendiliğinden birbirine çevrilmez. Harcama
                      ve kazançları masada gerçekleştiğinde kaydet.
                    </p>
                  </Section>
                </>
              )}
              {tab === "story" && (
                <>
                  <Section
                    eyebrow="06 · HATIRLANACAK ŞEYLER"
                    title="Neyi geride bıraktın?"
                    description="Kısa, somut ayrıntılar seç. Seni tanıyan biri, yarım bıraktığın bir iş, henüz tutulmamış bir söz."
                  >
                    <div className="pw-form-grid">
                      <Field label="Kişilik">
                        <textarea
                          rows={4}
                          maxLength={5000}
                          value={character.personality}
                          onChange={(e) =>
                            update({ personality: e.target.value })
                          }
                          placeholder="Yeni biriyle karşılaşınca ilk ne yaparsın?"
                        />
                      </Field>
                      <Field label="İdealler">
                        <textarea
                          rows={4}
                          maxLength={5000}
                          value={character.ideals}
                          onChange={(e) => update({ ideals: e.target.value })}
                          placeholder="Neyi kaybetmemek için riske girersin?"
                        />
                      </Field>
                      <Field label="Bağlar">
                        <textarea
                          rows={4}
                          maxLength={5000}
                          value={character.bonds}
                          onChange={(e) => update({ bonds: e.target.value })}
                          placeholder="Kime borçlusun? Kimi eve döndürmek istiyorsun?"
                        />
                      </Field>
                      <Field label="Kusurlar">
                        <textarea
                          rows={4}
                          maxLength={5000}
                          value={character.flaws}
                          onChange={(e) => update({ flaws: e.target.value })}
                          placeholder="Hangi durumda kötü bir karar verirsin?"
                        />
                      </Field>
                      <Field label="Geçmiş hikâyesi" wide>
                        <textarea
                          rows={8}
                          maxLength={20000}
                          value={character.backstory}
                          onChange={(e) =>
                            update({ backstory: e.target.value })
                          }
                          placeholder="Nerede büyüdün, kimle bağ kurdun, yola neden çıktın?"
                        />
                      </Field>
                    </div>
                  </Section>
                  <Section
                    title="Oturum notların"
                    description="Tanıştığın kişileri, verdiğin sözleri, keşfettiğin yerleri ve bir sonraki oturumda yapmak istediklerini kaydet."
                  >
                    <Field label="Kişisel notlar">
                      <textarea
                        rows={12}
                        maxLength={30000}
                        value={character.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                        placeholder="Tarih — yer — ne oldu?"
                      />
                    </Field>
                  </Section>
                </>
              )}
              {tab === "sheet" && (
                <>
                  <Section
                    eyebrow="07 · MASAYA GÖTÜR"
                    title="A4 karakter nüshan."
                    description="Karakter bilgileri bu önizlemeden ayrı, gerçek A4 sayfalara yerleşir. Uzayan notlar ve büyüler ek sayfalara devam eder."
                    action={
                      <button
                        className="pw-primary"
                        onClick={() => void print()}
                      >
                        <Printer size={15} />
                        Yazdır / PDF olarak kaydet
                      </button>
                    }
                  >
                    <div className="pw-print-actions">
                      <a
                        href="/downloads/Aruzahr-Karakter-Kagidi-A4.pdf"
                        download
                      >
                        <Download size={14} />
                        Boş A4 şablonu
                      </a>
                      <a href="/downloads/Aruzahr-Buyu-Defteri-A4.pdf" download>
                        <Download size={14} />
                        Boş büyü defteri
                      </a>
                    </div>
                    <p className="pw-inline-note">
                      Yazdırma penceresinde A4, %100 ölçek ve tarayıcı
                      üstbilgi/altbilgileri kapalı kullan. PDF olarak kaydet
                      seçeneği aynı nüshayı dosyaya dönüştürür.
                    </p>
                  </Section>
                  <div className="pw-sheet-preview">
                    <PlayerSheet character={character} spells={spells} />
                  </div>
                </>
              )}
            </div>
            <aside className="pw-sidebar">
              <div className="pw-current-section">
                <span className="pw-eyebrow">ŞU ANDA</span>
                <stage.icon size={24} strokeWidth={1} />
                <h2>{stage.name}</h2>
                <p>{stage.note}</p>
              </div>
              <div className="pw-mini-stat">
                <span>Can</span>
                <strong>
                  {character.hp} <small>/ {stats!.maxHp}</small>
                </strong>
              </div>
              <div className="pw-mini-stat">
                <span>Zırh sınıfı</span>
                <strong>{stats!.armorClass}</strong>
              </div>
              <div className="pw-mini-stat">
                <span>Ustalık</span>
                <strong>{signed(stats!.proficiency)}</strong>
              </div>
              {stats!.spellAbility && (
                <div className="pw-mini-stat">
                  <span>Büyü niteliği</span>
                  <strong>
                    {abilityAbbr[stats!.spellAbility]}{" "}
                    <small>
                      {signed(
                        abilityModifier(character.scores[stats!.spellAbility]),
                      )}
                    </small>
                  </strong>
                </div>
              )}
              <div className="pw-side-tip">
                <BookOpen size={17} />
                <p>
                  {tab === "spells"
                    ? "Önce arşivden öğrenmek istediklerini defterine ekle. Hazırlayan bir sınıfsan o gün kullanacaklarını ayrıca hazırla."
                    : tab === "adventure"
                      ? "Hasarı ve kullanılan özellikleri olduğu anda işaretle. Dinlenme bittiğinde ilgili düğmeyle kaynaklarını yenile."
                      : tab === "abilities"
                        ? "Becerinin yanındaki sayıya basarak özel bir d20 kontrolü atabilirsin. Bu atış yayın masasına gönderilmez."
                        : "Her değişiklik bu tarayıcıya kaydolur. Başka cihazdan devam etmek için yedeğini indirip orada aç."}
                </p>
              </div>
              {warnings.length > 0 && (
                <details className="pw-character-warnings">
                  <summary>
                    <Shield size={14} />
                    {warnings.length} kontrol notu
                  </summary>
                  <ul>
                    {warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </details>
              )}
              <button
                className="pw-side-export"
                onClick={() => downloadCharacter(character)}
              >
                <Download size={15} />
                Karakter yedeğini indir
              </button>
              <small className="pw-rules-note">
                D&D 5e · 2014 kuralları
                <br />
                Tek sınıflı karakterler · seviyeler 1–20
              </small>
            </aside>
          </div>
        </>
      )}
      {message && (
        <div className="pw-toast" role="status">
          <p>{message}</p>
          <button aria-label="Bilgiyi kapat" onClick={() => setMessage("")}>
            <X size={15} />
          </button>
        </div>
      )}
      {rollMessage && (
        <div className="pw-roll-toast" role="status">
          <Sparkles size={18} />
          <strong>{rollMessage}</strong>
          <button
            aria-label="Zar sonucunu kapat"
            onClick={() => setRollMessage("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
      <dialog
        ref={modalDialog}
        className="pw-dialog"
        onCancel={() => setModal(null)}
        onClose={() => setModal(null)}
        aria-label={
          modal === "create"
            ? "Yeni karakter oluştur"
            : modal === "delete"
              ? "Karakteri sil"
              : modal === "long-rest"
                ? "Uzun dinlenme"
                : "Kısa dinlenme"
        }
      >
        <button
          className="pw-dialog-close"
          aria-label="Pencereyi kapat"
          onClick={() => setModal(null)}
        >
          <X size={18} />
        </button>
        {modal === "create" ? (
          <>
            <span className="pw-eyebrow">YENİ BİR YOLCU</span>
            <h2>İlk satırı yaz.</h2>
            <p>
              İsmini sonra değiştirebilirsin. Sınıfın ve seviyen karakter
              defterinin başlangıcını belirler.
            </p>
            <Field label="Yeni karakterin adı">
              <input
                autoFocus
                maxLength={100}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Yolcunun adı"
                onKeyDown={(e) => {
                  if (e.key === "Enter") create();
                }}
              />
            </Field>
            <div className="pw-form-grid">
              <Field label="Başlangıç sınıfı">
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value as ClassId)}
                >
                  {classDefinitions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Başlangıç seviyesi">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newLevel}
                  onChange={(e) => setNewLevel(number(e.target.value, 1, 20))}
                />
              </Field>
            </div>
            <button className="pw-primary" onClick={create}>
              Karakter defterini aç <ArrowRight size={16} />
            </button>
            <aside className="pw-new-class-help" aria-live="polite">
              <strong>{classDefinitions.find(c => c.id === newClass)?.name} nasıl oynanır?</strong>
              <p>{classDefinitions.find(c => c.id === newClass)?.description}</p>
              <small>İlk oyunun için 1. seviye seç. Soy, nitelik, eşya ve büyü seçimlerini sonraki ekranda adım adım yapabilirsin.</small>
            </aside>
            <small>D&D 5e 2014 · Kayıt bu tarayıcıda saklanır.</small>
          </>
        ) : modal === "delete" ? (
          <>
            <span className="pw-eyebrow">BU TARAYICIDAKİ KAYIT</span>
            <h2>{character?.name} silinsin mi?</h2>
            <p>
              Bu karakterin can, büyü, eşya ve not kayıtları kaldırılır. Devam
              etmeden önce istersen JSON yedeğini indir.
            </p>
            <div className="pw-dialog-actions">
              <button onClick={() => character && downloadCharacter(character)}>
                <Download size={14} />
                Önce yedek indir
              </button>
              <button
                className="pw-danger"
                onClick={() => {
                  setPlayers((previous) =>
                    previous.filter((c) => c.id !== character?.id),
                  );
                  setModal(null);
                  navigate("/play");
                }}
              >
                Karakteri sil
              </button>
            </div>
          </>
        ) : modal === "long-rest" ? (
          <>
            <span className="pw-eyebrow">DİNLENME TAMAMLANDIĞINDA</span>
            <h2>Uzun dinlenme</h2>
            <p>
              Canı, normal ve akit büyü yuvalarını, uzun dinlenmede dönen
              özelliklerini yeniler. Harcanmış can zarlarının en az birini,
              toplam seviyenin yarısı kadarını geri verir. Dinlenmenin süre ve
              koşullarını masada doğrula. Tükenmişlik yalnız yeterli yiyecek ve
              su varsa bir azalır.
            </p>
            <label className="pw-rest-supplies">
              <input
                type="checkbox"
                checked={restSupplies}
                onChange={(e) => setRestSupplies(e.target.checked)}
              />
              Yeterli yiyecek ve su var
            </label>
            <button
              className="pw-primary"
              onClick={() => {
                try {
                  if (character)
                    update(longRest(character, { foodAndWater: restSupplies }));
                  setModal(null);
                  setMessage(
                    "Uzun dinlenme işlendi. Kaynakların karakter kurallarına göre yenilendi.",
                  );
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              <Moon size={16} />
              Uzun dinlenmeyi tamamla
            </button>
          </>
        ) : modal === "short-rest" ? (
          <>
            <span className="pw-eyebrow">BİR SOLUKLANMA</span>
            <h2>Kısa dinlenme</h2>
            <p>
              Akit büyüsü ve kısa dinlenmede dönen özellikler yenilenir. Can
              puanı kendiliğinden dolmaz; can zarı harcama düğmesini ayrıca
              kullan.
            </p>
            <button
              className="pw-primary"
              onClick={() => {
                if (character) update(shortRest(character));
                setModal(null);
                setMessage("Kısa dinlenme işlendi. Can puanı değiştirilmedi.");
              }}
            >
              <Moon size={16} />
              Kısa dinlenmeyi tamamla
            </button>
          </>
        ) : null}
      </dialog>
      <dialog
        ref={selectedSpellDialog}
        className="pw-spell-dialog"
        aria-label="Büyü ayrıntısı"
        onCancel={() => setSelectedSpell("")}
        onClose={() => setSelectedSpell("")}
      >
        {spell && character && limits && stats && (
          <>
            <header>
              <span className="pw-eyebrow">
                {spell.level === 0 ? "BASİT BÜYÜ" : spell.level + ". DERECE"} ·{" "}
                {schools[spell.school] || spell.school}
              </span>
              <button
                aria-label="Büyü ayrıntısını kapat"
                onClick={() => setSelectedSpell("")}
              >
                <X size={18} />
              </button>
            </header>
            <h2>{spell.name}</h2>
            {spell.englishName && (
              <details className="pw-english-disclosure">
                <summary>İngilizce adı</summary>
                <p className="pw-spell-english">{spell.englishName}</p>
              </details>
            )}
            <dl>
              <div>
                <dt>Kullanım süresi</dt>
                <dd>{spell.castingTime}</dd>
              </div>
              <div>
                <dt>Menzil</dt>
                <dd>{spell.range}</dd>
              </div>
              <div>
                <dt>Bileşenler</dt>
                <dd>
                  {spell.components
                    .map(
                      (c) => ({ V: "Söz", S: "Hareket", M: "Malzeme" })[c] || c,
                    )
                    .join(" · ")}
                </dd>
              </div>
              <div>
                <dt>Süre</dt>
                <dd>
                  {spell.concentration ? "Yoğunlaşma · " : ""}
                  {spell.duration}
                </dd>
              </div>
            </dl>
            {spell.material && (
              <p className="pw-material">
                <strong>Malzeme:</strong> {spell.material}
              </p>
            )}
            <div className="pw-spell-fulltext">
              {spell.description
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
            {alwaysPrepared.has(spell.id) && (
              <p className="pw-inline-note">
                Bu alan veya yemin büyüsü her zaman hazırdır; normal hazırlık
                sayısına dahil değildir.
              </p>
            )}
            {spell.higherLevels && (
              <section>
                <h3>Üst derece / seviye artışı</h3>
                <p>{spell.higherLevels}</p>
              </section>
            )}
            <p className="pw-spell-classes">
              <strong>Sınıflar:</strong>{" "}
              {spell.classes
                .map(
                  (id) => classDefinitions.find((c) => c.id === id)?.name || id,
                )
                .join(" · ")}
              {spell.ritual ? " · Ritüel" : ""}
            </p>
            <footer>
              <div className="pw-dialog-actions">
                <button
                  className="pw-primary"
                  disabled={
                    alwaysPrepared.has(spell.id) ||
                    (!canSelectSpell(character, spell) &&
                      !character.spellbook.includes(spell.id))
                  }
                  onClick={() => toggleSpell(spell)}
                >
                  {alwaysPrepared.has(spell.id)
                    ? "Her zaman hazır"
                    : character.spellbook.includes(spell.id)
                      ? "Defterden çıkar"
                      : "Deftere ekle"}
                </button>
                {!alwaysPrepared.has(spell.id) &&
                  spell.level > 0 &&
                  limits.prepared !== null &&
                  canSelectSpell(character, spell) && (
                    <button onClick={() => togglePrepared(spell)}>
                      {character.preparedSpells.includes(spell.id)
                        ? "Hazırlığını kaldır"
                        : "Bugün için hazırla"}
                    </button>
                  )}
              </div>
              {(character.spellbook.includes(spell.id) ||
                alwaysPrepared.has(spell.id)) &&
                canSelectSpell(character, spell) && (
                  <div className="pw-cast-controls">
                    {spell.level > 0 && character.classId !== "warlock" && (
                      <Field label="Kullanılacak büyü yuvası">
                        <select
                          value={spellCastLevel}
                          onChange={(e) =>
                            setSpellCastLevel(Number(e.target.value))
                          }
                        >
                          {stats.slots.map(
                            (total, index) =>
                              total > 0 &&
                              index + 1 >= spell.level && (
                                <option
                                  key={index}
                                  value={index + 1}
                                  disabled={
                                    (character.usedSpellSlots[index] || 0) >=
                                    total
                                  }
                                >
                                  {index + 1}. derece ·{" "}
                                  {Math.max(
                                    0,
                                    total -
                                      (character.usedSpellSlots[index] || 0),
                                  )}{" "}
                                  boş yuva
                                </option>
                              ),
                          )}
                        </select>
                      </Field>
                    )}
                    {canRitualCast(character, spell) && (
                      <button onClick={() => cast(spell, true)}>
                        Ritüel uygula · yuva harcamaz
                      </button>
                    )}
                    <button onClick={() => cast(spell)}>
                      <Sparkles size={15} />
                      {spell.level === 0
                        ? "Basit büyüyü kullan"
                        : "Büyüyü kullan ve kaydet"}
                    </button>
                  </div>
                )}
              {customSpellIds.has(spell.id) && (
                <button
                  className="pw-custom-delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Bu özel büyü arşivden kaldırılsın mı? Karakter kayıtlarındaki kimliği korunur; istersen aynı dosyayı yeniden ekleyebilirsin.",
                      )
                    )
                      try {
                        removeCustomPlayerSpell(spell.id);
                        setSelectedSpell("");
                        void loadPlayerSpells()
                          .then(setSpells)
                          .catch((e) => setMessage(e.message));
                      } catch (e) {
                        setMessage((e as Error).message);
                      }
                  }}
                >
                  Özel büyüyü arşivden kaldır
                </button>
              )}
              <p className="pw-source">
                {spell.source} ·{" "}
                {customSpellIds.has(spell.id)
                  ? "Oyuncunun eklediği büyü; kaynak ve izinler bu kayda aittir."
                  : "Türkçe oyun çevirisi · SRD 5.1 / CC BY 4.0."}
              </p>
            </footer>
          </>
        )}
      </dialog>
    </div>
  );
}
