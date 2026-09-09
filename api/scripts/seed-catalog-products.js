/**
 * Seeds the HAJAR catalogue — generated from the Shopify product export.
 *   node scripts/seed-catalog-products.js
 * Safe to re-run: products are upserted by slug, so dashboard edits to any
 * field are overwritten but nothing is duplicated.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

/**
 * coverSlug names the piece whose first image fronts the collection. Chosen for
 * shots with room around the model — those survive a card crop; tight studio
 * shots do not.
 */
const CATEGORIES = [
  { name: 'HAJAR', slug: 'hajar', tagline: 'Modern formals, made more accessible.', parentSlug: '', sortOrder: 1, coverSlug: 'lilac-eclat' },
  { name: 'ZOUQ 1', slug: 'zouq-1', tagline: 'The founding edit.', parentSlug: 'hajar', sortOrder: 2, coverSlug: 'whimsical-charm' },
  { name: 'ZOUQ 2', slug: 'zouq-2', tagline: 'The second edit.', parentSlug: 'hajar', sortOrder: 3, coverSlug: 'frost-silhouette' },
  { name: 'HAJAR BY NAZISH ALI', slug: 'hajar-by-nazish-ali', tagline: 'Where craftsmanship becomes couture.', parentSlug: '', sortOrder: 4, coverSlug: 'moonlight-pearl' },
];

const PRODUCTS = [
  {
    "name": "Blush Hour",
    "slug": "blush-hour",
    "category": "HAJAR BY NAZISH ALI",
    "price": 84600,
    "stock": 100,
    "status": "published",
    "tags": [
      "limited"
    ],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "The hour everything softens.\n\nBlush Hour is worked on barely pink net, its surface densely hand-embellished with silver zardozi, dimensional floral appliqué, hand-set pearls, and crystal detailing that cascades along the front and gathers at the hem in rich, sculptural clusters. Sheer sleeves carry the embellishment through with a lighter hand, keeping the silhouette weightless despite its depth of craft. A matching straight pant grounds the look.\n\nNamed for that brief hour when the light turns pink — fleeting in nature, permanent in thread.",
    "highlights": [
      "Hand-worked zardozi",
      "Hand-set pearls",
      "Crystal accents"
    ],
    "sizes": [],
    "colors": [
      {
        "name": "Blush",
        "hex": "#E8CBD0"
      }
    ],
    "specifications": [
      {
        "key": "Colour",
        "value": "floral, pink"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/WhatsAppImage2026-09-03at5.29.14PM_1_3442ef59-654c-4ebe-9f11-cbac50dcd4ac.jpg?v=1788848511",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/WhatsAppImage2026-09-03at5.29.14PM_19221e55-39cd-412f-99e9-6da8805e5a72.jpg?v=1788848511",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/WhatsAppImage2026-09-03at5.29.13PM_e983fd24-78ad-4371-8c1e-c56100edeef5.jpg?v=1788848512"
    ],
    "seoTitle": "Blush Hour — HAJAR BY NAZISH ALI | HAJAR",
    "seoDescription": "Blush Hour is worked on barely pink net, its surface densely hand-embellished with silver zardozi, dimensional floral appliqué, hand-set pearls, and…"
  },
  {
    "name": "Moonlight Pearl",
    "slug": "moonlight-pearl",
    "category": "HAJAR BY NAZISH ALI",
    "price": 130000,
    "stock": 100,
    "status": "published",
    "tags": [
      "limited"
    ],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Moonlight Pearl is a handcrafted luxury ensemble in a soft coconut milk ivory shade, featuring a modern halter neckline, intricately hand-embellished pearls and crystals, and coordinated culottes. A timeless expression of Pakistani artistry and contemporary sophistication.",
    "highlights": [
      "Hand-set pearls",
      "Crystal accents"
    ],
    "sizes": [],
    "colors": [
      {
        "name": "Ivory",
        "hex": "#F2EDE3"
      }
    ],
    "specifications": [
      {
        "key": "Colour",
        "value": "white, dots"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/IMG_5233_JPG.jpg?v=1788848149",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/IMG_5235_JPG.jpg?v=1788848149",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/IMG_5234_JPG.jpg?v=1788848149",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/IMG_5238_JPG.jpg?v=1788848149",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/IMG_5237_JPG.jpg?v=1788848149"
    ],
    "seoTitle": "Moonlight Pearl — HAJAR BY NAZISH ALI | HAJAR",
    "seoDescription": "Moonlight Pearl is a handcrafted luxury ensemble in a soft coconut milk ivory shade, featuring a modern halter neckline, intricately hand-embellished…"
  },
  {
    "name": "Subh-e-Feroza",
    "slug": "subh-e-feroza",
    "category": "ZOUQ 1",
    "price": 46000,
    "stock": 200,
    "status": "published",
    "tags": [],
    "fabric": "Silk",
    "pieces": "2 Piece",
    "description": "Style is Hard to Define, But Easy to Spot!\n\nOne can never go wrong with a classic raw-silk shalwar qameez. Adorned with timeless embellishments of dabka, pearls, and sequins, relive the classy vintage times with this stunning blue ensemble. Mimicking the gorgeous blue sky on a clear day with a dash of antique elements, this outfit is definitely a stunner!",
    "highlights": [
      "Dabka and kora hand work",
      "Hand-set pearls",
      "Sequin detailing"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blue",
        "hex": "#BFD4E0"
      }
    ],
    "specifications": [
      {
        "key": "Fabric",
        "value": "silk"
      },
      {
        "key": "Colour",
        "value": "blue"
      },
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-SUBH-E-FEROZA-1-1000x1500.jpg?v=1781093275",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-SUBH-E-FEROZA-2-1000x1500.jpg?v=1781093275",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-SUBH-E-FEROZA-3-1000x1500.jpg?v=1781093275"
    ],
    "seoTitle": "Subh-e-Feroza — ZOUQ 1 | HAJAR",
    "seoDescription": "One can never go wrong with a classic raw-silk shalwar qameez. Adorned with timeless embellishments of dabka, pearls, and sequins, relive the classy…"
  },
  {
    "name": "Midnight Breeze",
    "slug": "midnight-breeze",
    "category": "ZOUQ 1",
    "price": 44000,
    "stock": 200,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Fashion is What You Buy, Style is What You Do With It!\n\nMade from the finest and luxurious velvet, this simple yet chic outfit is the perfect pick for your evenings. Be it a dinner date with your better half or a night out with friends. The gorgeous teal-colored 2-piece is adorned with the evergreen elements of dabka, kora, sequins and thread work, and tassels on the back. The culotte comes with a sprinkling of motifs all over.",
    "highlights": [
      "Dabka and kora hand work",
      "Sequin detailing",
      "Tassel finish"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Teal",
        "hex": "#1F4E4C"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MIDNIGHT-BREEZE-1-1000x1500.jpg?v=1781093274",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MIDNIGHT-BREEZE-2-1000x1500.jpg?v=1781093274",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MIDNIGHT-BREEZE-3-1000x1500.jpg?v=1781093274"
    ],
    "seoTitle": "Midnight Breeze — ZOUQ 1 | HAJAR",
    "seoDescription": "Made from the finest and luxurious velvet, this simple yet chic outfit is the perfect pick for your evenings. Be it a dinner date with your better half or…"
  },
  {
    "name": "Black Mist",
    "slug": "black-mist",
    "category": "ZOUQ 1",
    "price": 53000,
    "stock": 200,
    "status": "published",
    "tags": [
      "bridal"
    ],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Every Woman Needs a Black Dress in her Closet!\n\nDinner? Wedding? Engagement? Birthday? Black is the color for every occasion. This stunning black piece is made using raw silk of the finest quality. Featuring beautiful Resham and Sitara embroidery, this outfit is a wardrobe staple. The simple cut straight long shirt exudes elegance and style.",
    "highlights": [
      "Sitara embroidery",
      "Resham thread embroidery",
      "Raw silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#1A1A1A"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-BLACK-MIST-1-1000x1500.jpg?v=1781093273",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-BLACK-MIST-5-1000x1500.jpg?v=1781093273",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-BLACK-MIST-4-1000x1500.jpg?v=1781093273",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-BLACK-MIST-2-1000x1500.jpg?v=1781093273"
    ],
    "seoTitle": "Black Mist — ZOUQ 1 | HAJAR",
    "seoDescription": "Dinner? Wedding? Engagement? Birthday? Black is the color for every occasion. This stunning black piece is made using raw silk of the finest quality…"
  },
  {
    "name": "Husn-e-Mughal",
    "slug": "husn-e-mughal",
    "category": "ZOUQ 1",
    "price": 39000,
    "stock": 47,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Dress How You Want to Be Addressed!\n\nLook no less than a royalty. The softest velvet of the richest plum-maroonish hue is going to get you in the limelight. A stylish gown with slits at ankles, this piece boasts of everything that is pretty such as the kora, dabka, and cutdana in gorgeous gold.",
    "highlights": [
      "Dabka and kora hand work",
      "Cutdana detailing",
      "Luxe velvet"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Plum",
        "hex": "#5E2A3C"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-HUSN-E-MUGHAL-3-1000x1500.jpg?v=1781093272",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-HUSN-E-MUGHAL-1-1000x1500.jpg?v=1781093272",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-HUSN-E-MUGHAL-4-1000x1500.jpg?v=1781093272"
    ],
    "seoTitle": "Husn-e-Mughal — ZOUQ 1 | HAJAR",
    "seoDescription": "Look no less than a royalty. The softest velvet of the richest plum-maroonish hue is going to get you in the limelight. A stylish gown with slits at…"
  },
  {
    "name": "Whimsical Charm",
    "slug": "whimsical-charm",
    "category": "ZOUQ 1",
    "price": 60000,
    "stock": 200,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Life Isn’t Perfect But Your Outfit Can Be!\n\nMade of pure Irani silk, this soft amalgamation of peach and dusty pink is perfect for a summer event. With embroidered motifs at the front with Resham, Moti, and Dabka, this one is surely a head-turner.",
    "highlights": [
      "Dabka and kora hand work",
      "Resham thread embroidery",
      "Pure Irani silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blush",
        "hex": "#E8CBD0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-Whimsical-Charm-1-1000x1500.jpg?v=1781093271",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-Whimsical-Charm-2-1000x1500.jpg?v=1781093271",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-Whimsical-Charm-3-1000x1500.jpg?v=1781093271"
    ],
    "seoTitle": "Whimsical Charm — ZOUQ 1 | HAJAR",
    "seoDescription": "Made of pure Irani silk, this soft amalgamation of peach and dusty pink is perfect for a summer event. With embroidered motifs at the front with Resham…"
  },
  {
    "name": "Minty Hint",
    "slug": "minty-hint",
    "category": "ZOUQ 1",
    "price": 39000,
    "stock": 170,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Forget the Rules, If You Like It, Wear It!\n\nThis gorgeous mint-colored outfit is a sight for sore eyes. The ideal color for the sweltering summers. The dress comes with a heavily embroidered front with detailing on the trousers. A pure organza dupatta completes the look. Perfect for evening parties!",
    "highlights": [
      "Pure organza",
      "Hand embroidery throughout"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Pistachio",
        "hex": "#CBDFC8"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MINTY-HINT-1-1000x1500.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MINTY-HINT-2-1000x1500.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-MINTY-HINT-3-1000x1500.jpg?v=1781093270"
    ],
    "seoTitle": "Minty Hint — ZOUQ 1 | HAJAR",
    "seoDescription": "This gorgeous mint-colored outfit is a sight for sore eyes. The ideal color for the sweltering summers. The dress comes with a heavily embroidered front…"
  },
  {
    "name": "Ethereal Glory",
    "slug": "ethereal-glory",
    "category": "ZOUQ 1",
    "price": 53000,
    "stock": 50,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "People will Stare, Make it Worth Their While!\n\nLess is always more. This splendid dress is a dream with its soft and sultry silver tones. Adorned with sequins and dabka, this organza outfit is going to make you look right out of a fairytale. Featuring a simple design, this dress depicts the ideal look for a Nikkah, Engagement, or an intimate ghazal night.",
    "highlights": [
      "Dabka and kora hand work",
      "Sequin detailing",
      "Pure organza"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Silver",
        "hex": "#DBDBE0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-ETHEREAL-GLORY-1-1000x1500.jpg?v=1781093269",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-ETHEREAL-GLORY-2--1000x1500.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-ETHEREAL-GLORY-3-1000x1500.jpg?v=1781093270"
    ],
    "seoTitle": "Ethereal Glory — ZOUQ 1 | HAJAR",
    "seoDescription": "Less is always more. This splendid dress is a dream with its soft and sultry silver tones. Adorned with sequins and dabka, this organza outfit is going to…"
  },
  {
    "name": "Amber",
    "slug": "amber",
    "category": "ZOUQ 1",
    "price": 57000,
    "stock": 50,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "3 Piece",
    "description": "Fashion Changes but Style Endures!\n\nWrap yourself in 6 yards of love. Created from the finest quality of pure Irani silk, this phenomenal blue Saari is a showstopper. It comes with a heavily embellished blouse featuring dabka and threadwork. Perfect for family gatherings, formal evenings, and cozy dinners.",
    "highlights": [
      "Dabka and kora hand work",
      "Pure Irani silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blue",
        "hex": "#BFD4E0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-AMBER-2-1000x1500.jpg?v=1781093269",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-AMBER-4-1000x1500.jpg?v=1781093269",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-AMBER-1-1000x1500.jpg?v=1781093269",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/HJR-AMBER-3-1000x1500.jpg?v=1781093269"
    ],
    "seoTitle": "Amber — ZOUQ 1 | HAJAR",
    "seoDescription": "Wrap yourself in 6 yards of love. Created from the finest quality of pure Irani silk, this phenomenal blue Saari is a showstopper. It comes with a heavily…"
  },
  {
    "name": "Lilac Éclat",
    "slug": "lilac-eclat",
    "category": "ZOUQ 2",
    "price": 39999,
    "stock": 161,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "3 Piece",
    "description": "Where tradition meets modern grace!\n\nAn ethereal lilac three-piece, hand-finished to perfection. The intricately embellished jacket drapes effortlessly over a chic cropped choli, paired with a flowing paneled sharara. Silver-gold zardozi, luminous pearls, and delicate sequins create a luminous brilliance — the perfect choice for an engagement or a loved one’s grand celebration.",
    "highlights": [
      "Hand-worked zardozi",
      "Hand-set pearls",
      "Sequin detailing"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Lilac",
        "hex": "#D5C3E4"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095002-min.jpg?v=1781093267",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095102_413df95d-01ea-4cd7-8b2b-33ec17b974f0.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095152.jpg?v=1781093268",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095302_5aa755a8-2e9a-4a73-ad23-ef1d7a5977d4.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095472.jpg?v=1781093270",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/S_K095532-min.jpg?v=1781093268"
    ],
    "seoTitle": "Lilac Éclat — ZOUQ 2 | HAJAR",
    "seoDescription": "An ethereal lilac three-piece, hand-finished to perfection. The intricately embellished jacket drapes effortlessly over a chic cropped choli, paired with…"
  },
  {
    "name": "Frost Silhouette",
    "slug": "frost-silhouette",
    "category": "ZOUQ 2",
    "price": 45000,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Draped in flow, glowing in grace!\n\nTailored in 60gm ice-blue raw silk, Frost Silhouette pairs a sleek sleeveless shirt with matching culottes. Every panel is enriched with kora, dabka, and resham embroidery, blending theprecision of contemporary cuts with the opulence of heritage craftsmanship.",
    "highlights": [
      "Dabka and kora hand work",
      "Resham thread embroidery",
      "Raw silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blue",
        "hex": "#BFD4E0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-20_b14abce9-2ccf-4820-bb13-362d7edbee0e.jpg?v=1781093266",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-22_2nd.jpg?v=1781093266",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-23_3rd.jpg?v=1781093266",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-24_4rth.jpg?v=1781093266",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-21_5th.jpg?v=1781093266"
    ],
    "seoTitle": "Frost Silhouette — ZOUQ 2 | HAJAR",
    "seoDescription": "Tailored in 60gm ice-blue raw silk, Frost Silhouette pairs a sleek sleeveless shirt with matching culottes. Every panel is enriched with kora, dabka, and…"
  },
  {
    "name": "Ivory Regalia",
    "slug": "ivory-regalia",
    "category": "ZOUQ 2",
    "price": 37500,
    "stock": 160,
    "status": "published",
    "tags": [
      "bridal"
    ],
    "fabric": "",
    "pieces": "3 Piece",
    "description": "Soft hues, subtle shine — effortless style for every moment!\n\nA vision in pure silk, Ivory Regalia is adorned with masterfully crafted kora, dabka, and gold beadwork. The sweeping voluminous lehenga and radiant choli evoke the grandeur of royal courts, making it a stunning choice for a bride’s mehndi or nikkah steeped in timeless elegance.",
    "highlights": [
      "Dabka and kora hand work",
      "Gold beadwork",
      "Pure silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Champagne Gold",
        "hex": "#D8C08A"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-361st_ec66ad04-b170-4aa3-a263-05909ec78c3c.jpg?v=1781093265",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-02_2nd.jpg?v=1781093265",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-04_3rd.jpg?v=1781093265",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-03_4rth.jpg?v=1781093265"
    ],
    "seoTitle": "Ivory Regalia — ZOUQ 2 | HAJAR",
    "seoDescription": "A vision in pure silk, Ivory Regalia is adorned with masterfully crafted kora, dabka, and gold beadwork. The sweeping voluminous lehenga and radiant choli…"
  },
  {
    "name": "Pistachio Élégance",
    "slug": "pistachio-elegance",
    "category": "ZOUQ 2",
    "price": 39999,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Dress How You Want to Be Addressed!\n\nSoft pistachio silk flows like a gentle breeze, its shirt adorned with silver-thread embellishments and playful tassels along the sides. Paired with sleek straight pants carrying the same refined detailing, it’s the perfect companion for soirées and festive nights.",
    "highlights": [
      "Tassel finish",
      "Pure silk"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Pistachio",
        "hex": "#CBDFC8"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "6 to 8 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-28.jpg?v=1781093264",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-31.jpg?v=1781093264",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-29.jpg?v=1781093264",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-30.jpg?v=1781093264"
    ],
    "seoTitle": "Pistachio Élégance — ZOUQ 2 | HAJAR",
    "seoDescription": "Soft pistachio silk flows like a gentle breeze, its shirt adorned with silver-thread embellishments and playful tassels along the sides. Paired with sleek…"
  },
  {
    "name": "Peacock Royale",
    "slug": "peacock-royale",
    "category": "ZOUQ 2",
    "price": 38500,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Because true beauty is always in the finer touches!\n\nModern tailoring meets regal artistry in Peacock Royale. This blush-pink two-piece suit features a sharp blazer-style top and straight pants, crowned with hand-embroidered peacock motifs at the hem. A bold statement of poise and power.",
    "highlights": [
      "Hand embroidery throughout"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blush",
        "hex": "#E8CBD0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-25.jpg?v=1781093263",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-26.jpg?v=1781093262",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-27.jpg?v=1781093262"
    ],
    "seoTitle": "Peacock Royale — ZOUQ 2 | HAJAR",
    "seoDescription": "Modern tailoring meets regal artistry in Peacock Royale. This blush-pink two-piece suit features a sharp blazer-style top and straight pants, crowned with…"
  },
  {
    "name": "Rosé Lumière",
    "slug": "rose-lumiere",
    "category": "ZOUQ 2",
    "price": 35000,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Soft hues, strong presence!\n\nA blush-pink net frock brought to life with intricate embroidery, sitara shimmer, cut dana sparkle, and crystal accents. The glistening borders and cuffs, paired with dainty tassels at the back, create a look that radiates romance and celebration.",
    "highlights": [
      "Sitara embroidery",
      "Cutdana detailing",
      "Crystal accents"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Blush",
        "hex": "#E8CBD0"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-16.jpg?v=1781093261",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-17_2nd.jpg?v=1781093261",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-18_3rd.jpg?v=1781093261",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-19_4rth.jpg?v=1781093261"
    ],
    "seoTitle": "Rosé Lumière — ZOUQ 2 | HAJAR",
    "seoDescription": "A blush-pink net frock brought to life with intricate embroidery, sitara shimmer, cut dana sparkle, and crystal accents. The glistening borders and cuffs…"
  },
  {
    "name": "Moonlight Élan",
    "slug": "moonlight-elan",
    "category": "ZOUQ 2",
    "price": 32000,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "A dress that moves with every heartbeat!\n\nAs soft as moonlight, this white chiffon frock features a graceful front cut, bead-studded neckline, and lace-edged hem. Exquisite hand-thread embroidery flows into raw silk trousers, crafting a look that whispers timeless sophistication.",
    "highlights": [
      "Raw silk",
      "Hand embroidery throughout"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Ivory",
        "hex": "#F2EDE3"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-32.jpg?v=1781093260",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-33.jpg?v=1781093260",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-34.jpg?v=1781093261",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-35.jpg?v=1781093260"
    ],
    "seoTitle": "Moonlight Élan — ZOUQ 2 | HAJAR",
    "seoDescription": "As soft as moonlight, this white chiffon frock features a graceful front cut, bead-studded neckline, and lace-edged hem. Exquisite hand-thread embroidery…"
  },
  {
    "name": "Whisper Blanc",
    "slug": "whisper-blanc",
    "category": "ZOUQ 2",
    "price": 24500,
    "stock": 160,
    "status": "published",
    "tags": [],
    "fabric": "",
    "pieces": "2 Piece",
    "description": "Where minimalism meets sophistication!\n\nMinimalist yet meticulously detailed, Whisper Blanc features all-over hand embroidery in chiffon, accented with delicate beads and a graceful open front. Paired with classic raw silk pants, it’s the epitome of understated luxury for any grand or intimate occasion.",
    "highlights": [
      "Raw silk",
      "Hand embroidery throughout"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      {
        "name": "Ivory",
        "hex": "#F2EDE3"
      }
    ],
    "specifications": [
      {
        "key": "Lead time",
        "value": "4 to 6 Weeks"
      },
      {
        "key": "Care",
        "value": "Dry clean only"
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-05.jpg?v=1781093260",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-07_2ND.jpg?v=1781093259",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-08_3rd.jpg?v=1781093259",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-09_4rth.jpg?v=1781093259",
      "https://cdn.shopify.com/s/files/1/0693/2863/3971/files/Hajar-Final-Adapts-06_5th.jpg?v=1781093260"
    ],
    "seoTitle": "Whisper Blanc — ZOUQ 2 | HAJAR",
    "seoDescription": "Minimalist yet meticulously detailed, Whisper Blanc features all-over hand embroidery in chiffon, accented with delicate beads and a graceful open front…"
  }
];

async function main() {
  loadEnv();
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in api/.env');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { family: 4 });
  const products = mongoose.connection.collection('products');
  const categories = mongoose.connection.collection('categories');

  for (const c of CATEGORIES) {
    // A parent has no products of its own — borrow a cover from a child
    const childNames = CATEGORIES.filter((x) => x.parentSlug === c.slug).map(
      (x) => x.name,
    );
    const pool = PRODUCTS.filter(
      (p) => (p.category === c.name || childNames.includes(p.category)) && p.images.length,
    );
    const picked = c.coverSlug
      ? pool.find((p) => p.slug === c.coverSlug)
      : undefined;
    const cover = (picked ?? pool[0])?.images[0] ?? '';
    const { coverSlug, ...record } = c;
    void coverSlug;
    await categories.updateOne(
      { slug: c.slug },
      {
        $set: { ...record, image: cover, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    console.log('  collection  ' + c.name);
  }

  for (const p of PRODUCTS) {
    await products.updateOne(
      { slug: p.slug },
      {
        $set: { ...p, brand: 'HAJAR', updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    console.log(
      '  product     ' + p.category.padEnd(14) + p.name + '  (' + p.images.length + ' images)',
    );
  }

  console.log(
    '\n' + CATEGORIES.length + ' collections and ' + PRODUCTS.length + ' products upserted.',
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
