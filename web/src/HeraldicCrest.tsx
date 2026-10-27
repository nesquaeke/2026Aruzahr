import { useId, type ReactNode, type CSSProperties } from 'react'

export type CrestHouse = {
  id: string
  name: string
  blazon: string
  colors: readonly string[]
  symbol: string
}

const seedOf = (value: string) =>
  [...value].reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 7)

function emblem(symbol: string): ReactNode {
  switch (symbol) {
    case 'five-walls-sun':
      return (
        <>
          <circle
            cx="120"
            cy="73"
            r="18"
            fill="none"
            stroke="#d6b265"
            strokeWidth="7"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${60 + i * 11} ${202 - i * 12}v-16q${60 - i * 11} ${-125 + i * 22} ${120 - i * 22} 0v16`}
              fill="none"
              stroke="#d5dadb"
              strokeWidth="5"
            />
          ))}{' '}
        </>
      )
    case 'radiant-censer':
      return (
        <>
          <path d="M93 104h54l-9 43h-36zM86 98h68v9H86zM101 151h38v7h-38z" />
          <path
            d="m102 95 18-29 18 29M109 109v20m11-20v28m11-28v20"
            fill="none"
            strokeWidth="4"
          />
          <path
            d="M78 174h31v37H78zm53 0h31v37h-31z"
            fill="#35466c"
            stroke="#35466c"
          />
          <path
            d="M119 163v42m-9-40-8 37m28-37 8 37"
            fill="none"
            strokeWidth="3"
          />
        </>
      )
    case 'split-anvil':
      return (
        <>
          <path
            d="m61 112 31 7h24v23h-14q1 28-16 42v13h30v-78zm118 0-31 7h-24v23h14q-1 28 16 42v13h-30v-78z"
            fill="#cbd3d1"
            stroke="#cbd3d1"
          />
          <path
            d="m120 61 12 22-12 38-12-38z"
            fill="#b69acf"
            stroke="#b69acf"
          />
        </>
      )
    case 'beacon-wheel':
      return (
        <>
          <path
            d="m103 151 8-58h18l8 58zM105 80h30v15h-30zM99 79l21-24 21 24z"
            fill="#e4dfcc"
            stroke="#e4dfcc"
          />
          <path
            d="M84 197a36 36 0 0 1 72 0m-36-36v36m-26-25 26 25 26-25M101 91l-17 106m55-106 17 106"
            fill="none"
            strokeWidth="5"
          />
        </>
      )
    case 'quartz-fountain':
      return (
        <>
          <path d="M74 130V84l10-20 10 20v46zm36 0V67l10-22 10 22v63zm36 0V84l10-20 10 20v46z" />
          <path d="M76 174h88q-8 23-44 23t-44-23z" />
          <path d="M120 137q-19 24 0 27 19-3 0-27z" />
          <path d="M84 204h72" fill="none" strokeWidth="5" />
        </>
      )
    case 'twin-gate-river':
      return (
        <>
          <path
            d="M65 92h34v95H65zm76 0h34v95h-34zM62 81h12v12h8V81h12v12h9v10H62zm75 0h12v12h8V81h12v12h9v10h-41z"
            fill="#d3d9d5"
            stroke="#d3d9d5"
          />
          <path
            d="M120 104q-21 29 0 51t0 57"
            fill="none"
            stroke="#a8d5d8"
            strokeWidth="10"
          />
          <circle cx="120" cy="72" r="6" fill="#bd8b5f" stroke="none" />
        </>
      )
    case 'three-tongs':
      return (
        <>
          <path
            d="M116 197V96L96 72m28 125V96l20-24M81 184l58-76 1-27m-50 109 58-76 25-9m-14 79-58-76-1-27m50 109-58-76-25-9"
            fill="none"
            strokeWidth="7"
          />
          <path
            d="M107 152a15 15 0 1 1 25 10"
            fill="none"
            stroke="#e4dfcc"
            strokeWidth="5"
          />
        </>
      )
    case 'harbour-hook-tower':
      return (
        <>
          <path d="M87 78h60v102H87zM82 68h13v13h10V68h13v13h10V68h13v13h11v10H82z" />
          <path d="M111 106h13v20h-13" fill="#633d37" stroke="none" />
          <path
            d="M120 210v-53q0-25 25-25 27 0 23 25l-12-11M100 190h40"
            fill="none"
            stroke="#aab9c1"
            strokeWidth="9"
          />
        </>
      )
    case 'balanced-water-bowls':
      return (
        <>
          <path d="M64 145h45q-2 28-22 28t-23-28zm67 0h45q-2 28-22 28t-23-28z" />
          <path
            d="M116 174V95h8v79"
            fill="none"
            stroke="#3a4141"
            strokeWidth="4"
          />
          <circle
            cx="120"
            cy="75"
            r="15"
            fill="none"
            stroke="#3a4141"
            strokeWidth="4"
          />
          <path
            d="M69 153h33m35 0h33"
            fill="none"
            stroke="#b4d4c7"
            strokeWidth="3"
          />
        </>
      )
    case 'silk-scale':
      return (
        <>
          <path d="M117 78h6v116h-6zM79 103h82" />
          <path
            d="m87 105-17 45h34zm66 0-17 45h34zM68 153q19 25 38 0m28 0q19 25 38 0M95 202h50"
            fill="none"
            strokeWidth="4"
          />
          <path d="m77 133 11-17 11 17-11 9z" />
          <path
            d="M153 142q-15-12 0-27 14 15 0 27z"
            fill="none"
            strokeWidth="4"
          />
        </>
      )
    case 'dune-knot':
      return (
        <>
          <path
            d="M109 85q-29-24-43 0-10 21 13 31l64 21q27 6 32-16 6-23-25-25l-55 38q-24 19-2 36 23 17 36-12l14-52q7-25-18-27-21 0-15 24l25 49"
            fill="none"
            strokeWidth="8"
          />
          <path
            d="M69 195q26-11 52 0t49 0M78 208q25-9 50 0t34 0"
            fill="none"
            strokeWidth="4"
          />
          <path d="M117 173q-9-8-13 2-3 11 11 13h14v-7z" />
        </>
      )
    case 'joined-oars':
      return (
        <>
          <path d="m77 70 21 14 4 17 17 49-9 7-20-49-16-11-7-22zm86 0-21 14-4 17-17 49 9 7 20-49 16-11 7-22zM113 155h14v43h-14z" />
          <circle cx="102" cy="171" r="5" fill="#b8885d" stroke="none" />
          <circle cx="138" cy="171" r="5" fill="#b8885d" stroke="none" />
          <circle cx="120" cy="214" r="5" fill="#b8885d" stroke="none" />
        </>
      )
    case 'root-shell':
      return (
        <>
          <path
            d="M120 145 78 108q-13-29 7-39 20-17 35-2 15-15 35 2 20 10 7 39z"
            fill="#e9dcc1"
            stroke="#e9dcc1"
          />
          <path
            d="m120 137-24-53m24 53V77m0 60 24-53"
            fill="none"
            strokeWidth="4"
          />
          <path
            d="M120 145v38l-28 24m28-28 30 24m-31-24-3 33m-19-17-17 4m61-3 18 7"
            fill="none"
            strokeWidth="8"
          />
        </>
      )
    case 'keel-star':
      return (
        <>
          <path
            d="M120 187q-12-43-50-62m50 62q-5-66-29-85m29 85V91m0 96q5-66 29-85m-29 85q12-43 50-62"
            fill="none"
            strokeWidth="8"
          />
          <path d="M94 202h52M117 196h6" fill="none" strokeWidth="5" />
          <path
            d="m120 48 7 14 16 3-12 11 3 16-14-8-14 8 3-16-12-11 16-3z"
            fill="#e7e0c8"
            stroke="#e7e0c8"
          />
        </>
      )
    case 'fifteen-notches':
      return (
        <>
          <path
            d="M154 73a65 65 0 1 0 0 124 54 54 0 0 1 0-124z"
            fill="none"
            strokeWidth="12"
          />
          {Array.from({ length: 15 }, (_, i) => {
            const angle = ((70 + (i * 220) / 14) * Math.PI) / 180
            return (
              <path
                key={i}
                d={`M${120 + Math.cos(angle) * 65} ${135 + Math.sin(angle) * 65}l${-Math.cos(angle) * 10} ${-Math.sin(angle) * 10}`}
                fill="none"
                strokeWidth="4"
              />
            )
          })}
          <circle cx="121" cy="135" r="7" fill="#b6845b" stroke="none" />
        </>
      )
    case 'half-sun-granary':
      return (
        <>
          <path
            d="M79 119a41 41 0 0 1 82 0M120 69V54m-29 25-9-12m67 12 9-12"
            fill="none"
            strokeWidth="6"
          />
          <path d="m73 137 47-25 47 25zM84 141h72v55H84z" />
          <path
            d="M113 158h14v38h-14"
            fill="none"
            stroke="#b68a5a"
            strokeWidth="4"
          />
        </>
      )
    case 'shore-antler':
      return (
        <>
          <path
            d="M137 170q-36-29-49-73L72 78m23 36-26-4m31 20-24 11m10-41 4-27m17 71 13-26m-8 30 25-10"
            fill="none"
            strokeWidth="8"
          />
          <path
            d="m72 188 25 14h60l21-14M94 185l27-15 28 15"
            fill="none"
            strokeWidth="5"
          />
        </>
      )
    case 'split-mountain-hammer':
      return (
        <>
          <path
            d="m55 195 44-79 18 28 26-35 42 86z"
            fill="#d6dbd8"
            stroke="#d6dbd8"
          />
          <path d="M120 143v53" fill="none" stroke="#3b4246" strokeWidth="8" />
          <path
            d="M103 75h34v17h-11v61h-12V92h-11z"
            fill="#bd8b5f"
            stroke="#bd8b5f"
          />
          <path d="M112 64h16" fill="none" stroke="#3b4246" strokeWidth="5" />
        </>
      )
    case 'deep-chisel':
      return (
        <>
          <ellipse
            cx="120"
            cy="160"
            rx="54"
            ry="35"
            fill="none"
            stroke="#333b40"
            strokeWidth="15"
          />
          <path d="M109 61h22l-3 101-8 29-8-29z" />
          <path
            d="M115 78h10m-10 15h10m-10 15h10"
            fill="none"
            stroke="#606361"
            strokeWidth="3"
          />
        </>
      )
    case 'ram-spiral':
      return (
        <>
          <path
            d="M106 151q-51 1-44-44 7-36 35-23 20 12 6 34-11 15-23 3m54 30q51 1 44-44-7-36-35-23-20 12-6 34 11 15 23 3"
            fill="none"
            strokeWidth="10"
          />
          <path
            d="M104 168h32v15h-10v26h-12v-26h-10z"
            fill="#ae7b55"
            stroke="#ae7b55"
          />
        </>
      )
    case 'stone-bell':
      return (
        <>
          <path
            d="M81 83h78l-7 88 14 14H74l14-14z"
            fill="none"
            strokeWidth="10"
          />
          <path d="M111 99h18v60l-9 12-9-12z" />
          <path d="M92 71h56M88 201h64" fill="none" strokeWidth="6" />
        </>
      )
    case 'wind-nail':
      return (
        <>
          <path d="M108 67h28v15h-8l-4 98-10 25 2-25 4-98h-12z" />
          <path
            d="M60 105q-12-17 12-18h26m45 17h27q22 0 13-15M61 152h31q18 0 11-13m40 27h27q20 0 12-14M88 199q-25 0-19-13"
            fill="none"
            strokeWidth="5"
          />
        </>
      )
    case 'sail-knot':
      return (
        <>
          <path d="m117 69-47 88h47zm9 21 41 67h-41zM119 66h7v103h-7z" />
          <path
            d="M99 180q-16-18-24 0-6 17 12 19l51-19q20-6 25 11 3 13-12 13l-26-27-17 23"
            fill="none"
            strokeWidth="6"
          />
        </>
      )
    case 'breakwater-fork':
      return (
        <>
          <path d="M114 104h12v99h-12zM72 90h14v33q14 12 34 10 20 2 34-10V90h14v42q-18 19-48 16-30 3-48-16z" />
          <path d="M119 70v34" fill="none" strokeWidth="9" />
          <path d="M72 178h96" fill="none" stroke="#b5895e" strokeWidth="5" />
        </>
      )
    case 'tide-scroll':
      return (
        <>
          <path d="M82 78h67q-14 12-9 29l16 71H96l-16-71q-7-19 2-29z" />
          <path
            d="M82 78q-20 0-14 24h71m-43 76q-8 22 13 24h47q15-3 9-24"
            fill="none"
            strokeWidth="5"
          />
          <path
            d="M127 132q15-9 20 4 4 17-16 17-23 0-18-25 4-16 20-15"
            fill="none"
            stroke="#d8d6c5"
            strokeWidth="5"
          />
        </>
      )
    case 'six-island-ring':
      return (
        <>
          <circle
            cx="120"
            cy="136"
            r="45"
            fill="none"
            strokeWidth="2"
            opacity=".6"
          />
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3
            return (
              <path
                key={i}
                d={`M${120 + Math.cos(angle) * 48 - 11} ${136 + Math.sin(angle) * 48 - 6}q9-17 20-1l-2 14-18-2z`}
                fill="#e1dcc8"
                stroke="#e1dcc8"
              />
            )
          })}
          <path
            d="M161 112q12-6 18-18"
            fill="none"
            stroke="#b1875c"
            strokeWidth="7"
          />
        </>
      )
    case 'shadow-eye-oar':
      return (
        <>
          <path
            d="M120 91h10v96l11 15-15 19-15-19 9-15z"
            fill="#ded8c3"
            stroke="#ded8c3"
          />
          <path
            d="M64 123q46-41 104-2-56 44-104 2z"
            fill="#25242d"
            stroke="#98919b"
            strokeWidth="5"
          />
          <circle
            cx="119"
            cy="123"
            r="15"
            fill="#0f171d"
            stroke="#786d7d"
            strokeWidth="4"
          />
          <circle
            cx="126"
            cy="200"
            r="6"
            fill="none"
            stroke="#b4875c"
            strokeWidth="3"
          />
        </>
      )
    case 'swift-fin':
      return (
        <>
          <path d="M82 183q38-42 77-99-11 77-55 104z" />
          <path
            d="M72 161q-18-10-26-5m35 20q-18-5-28 0m38 15q-18-2-28 5"
            fill="none"
            stroke="#b8885d"
            strokeWidth="5"
          />
        </>
      )
    case 'closed-shell-key':
      return (
        <>
          <path d="M120 144 77 109q-16-29 8-41 18-17 35-2 17-15 35 2 24 12 8 41zM78 112q43 16 85 0l-9 38h-68z" />
          <path
            d="M85 111q35 12 69 0"
            fill="none"
            stroke="#a08256"
            strokeWidth="4"
          />
          <circle
            cx="127"
            cy="171"
            r="12"
            fill="none"
            stroke="#e1d6b9"
            strokeWidth="7"
          />
          <path
            d="M116 177h-30v21h-9v-30h40"
            fill="none"
            stroke="#e1d6b9"
            strokeWidth="7"
          />
        </>
      )
    case 'twin-hook':
      return (
        <>
          <path
            d="M96 68v91q0 34-23 31-24-3-17-28l10 10m78-104v91q0 34 23 31 24-3 17-28l-10 10M81 85h30m18 0h30"
            fill="none"
            strokeWidth="9"
          />
          <path d="M120 102v104" fill="none" stroke="#a56661" strokeWidth="5" />
        </>
      )
    case 'cooling-bridge':
      return (
        <>
          <path
            d="M63 123h114v61h-22q0-44-35-44t-35 44H63z"
            fill="#d9d7c4"
            stroke="#d9d7c4"
          />
          <path
            d="M96 196q-10-12 1-22 13 13-1 22zm48 0q-10-12 1-22 13 13-1 22z"
            fill="#b77e55"
            stroke="#b77e55"
          />
        </>
      )
    case 'ember-seed':
      return (
        <>
          <path d="M120 77q-40 31-33 71l26 24-7-55zM126 77q39 31 31 71l-25 24 5-55zM114 177l9-50 9 50-9 19z" />
          <path
            d="M119 118q-14 24 3 34 17-10 4-34z"
            fill="#383331"
            stroke="#383331"
          />
          <path
            d="M123 194v18m0-11q28-1 26-22-23 0-26 22"
            fill="none"
            stroke="#667e5c"
            strokeWidth="5"
          />
        </>
      )
    case 'basalt-cup':
      return (
        <>
          <path
            d="M71 122h98l-15 50-34 20-34-20z"
            fill="#ddd8c0"
            stroke="#ddd8c0"
          />
          <path d="M77 130h86" fill="none" stroke="#6d6e62" strokeWidth="4" />
          <path
            d="M120 108q-23-21 0-50 24 29 0 50z"
            fill="#c5a365"
            stroke="#c5a365"
          />
          <path
            d="M91 207h17m23 0h18"
            fill="none"
            stroke="#969281"
            strokeWidth="4"
          />
        </>
      )
    default:
      return (
        <>
          <path d="m120 64 20 38 42 6-31 31 7 44-38-21-38 21 7-44-31-31 42-6z" />
          <path
            d="m120 90 13 28 27 4-20 20 4 27-24-13-24 13 4-27-20-20 27-4z"
            fill="none"
            className="crest-cutline"
            style={{
              fill: 'none',
              stroke: 'var(--crest-ground)',
              strokeWidth: 4,
            }}
          />
        </>
      )
  }
}

/** Original scalable heraldry. Frame and words stay separate from the emblem. */
export default function HeraldicCrest({
  house,
  className = '',
  decorative = false,
}: {
  house: CrestHouse
  className?: string
  decorative?: boolean
}) {
  const key = 'crest-' + useId().replaceAll(':', '')
  const seed = seedOf(house.id),
    [ground = '#273334', charge = '#d5c29a'] = house.colors
  const royal = /vaeranth|royal|kraliyet/.test(house.id)
  const mask =
    seed % 3 === 0
      ? 'M36 44Q120 29 204 44v113q0 65-84 111-84-46-84-111z'
      : seed % 3 === 1
        ? 'M36 42h168v112q0 79-84 117-84-38-84-117z'
        : 'M37 45q83 13 166 0v101q-2 75-83 120-81-45-83-120z'
  const motif = house.symbol
  return (
    <svg
      className={'heraldic-crest ' + className}
      viewBox="0 0 240 300"
      width="240"
      height="300"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : key + '-title'}
      data-house-crest={house.id}
      data-motif={motif}
    >
      {!decorative && (
        <title id={key + '-title'}>
          {`${house.name} arması — ${house.blazon}`}
        </title>
      )}
      <defs>
        <clipPath id={key + '-clip'}>
          <path d={mask} />
        </clipPath>
        <linearGradient id={key + '-metal'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e1c994" />
          <stop offset=".32" stopColor="#907048" />
          <stop offset=".6" stopColor="#d5b97c" />
          <stop offset="1" stopColor="#66543a" />
        </linearGradient>
        <linearGradient id={key + '-shade'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".05" />
          <stop offset=".6" stopColor="#000000" stopOpacity=".05" />
          <stop offset="1" stopColor="#000000" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <path d={mask} fill={ground} />
      <g clipPath={'url(#' + key + '-clip)'}>
        {seed % 5 === 0 && (
          <path d="M20 35h100v240H20z" fill={charge} opacity=".2" />
        )}
        {seed % 5 === 1 && (
          <path
            d="M20 40h200v48H20zM20 225h200v50H20z"
            fill={charge}
            opacity=".2"
          />
        )}
        {seed % 5 === 2 && (
          <path d="M21 43 219 242v48L21 92z" fill={charge} opacity=".18" />
        )}
        {seed % 5 === 3 && (
          <path
            d="m20 195 100-59 100 59v36l-100-59-100 59z"
            fill={charge}
            opacity=".2"
          />
        )}
        {seed % 5 === 4 && (
          <path
            d="M20 41h100v112H20zm100 112h100v125H120z"
            fill={charge}
            opacity=".15"
          />
        )}
        <g
          fill={charge}
          stroke={charge}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ '--crest-ground': ground } as CSSProperties}
        >
          {emblem(motif)}
        </g>
        <path d={mask} fill={'url(#' + key + '-shade)'} pointerEvents="none" />
      </g>
      <path
        d={mask}
        fill="none"
        stroke={'url(#' + key + '-metal)'}
        strokeWidth="4"
      />
      <path
        d={mask}
        fill="none"
        stroke={charge}
        strokeWidth="1"
        opacity=".26"
        transform="translate(8 9) scale(.93)"
      />
      <path
        d="m35 34 8-10 9 13m136 0 9-13 8 10M101 275l19 11 19-11"
        fill="none"
        stroke={'url(#' + key + '-metal)'}
        strokeWidth="3"
      />
      {royal ? (
        <path
          d="m83 29-7-19 26 10 18-17 18 17 26-10-7 19z"
          fill={'url(#' + key + '-metal)'}
        />
      ) : (
        <path d="m104 25 16-13 16 13-16-5z" fill={'url(#' + key + '-metal)'} />
      )}
      <circle cx="120" cy="277" r="3" fill={charge} />
    </svg>
  )
}
