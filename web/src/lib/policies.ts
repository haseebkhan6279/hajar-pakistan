/**
 * The published website policies for Hajar by Nazish Ali.
 *
 * This is legal copy — supplied by the business and reproduced verbatim. Do not
 * paraphrase, summarise or "tidy" the wording when editing; change it only when
 * the business supplies new text.
 */

export type PolicyBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export type PolicySection = {
  heading: string;
  blocks: PolicyBlock[];
};

export type Policy = {
  slug: string;
  title: string;
  navLabel: string;
  intro: string;
  metaDescription: string;
  sections: PolicySection[];
  /** Closing acknowledgement line, where the source document carries one */
  acknowledgement?: string;
};

const p = (text: string): PolicyBlock => ({ kind: "p", text });
const list = (items: string[]): PolicyBlock => ({ kind: "list", items });

export const POLICIES: Policy[] = [
  /* ----------------------------------------------- Return & exchange */
  {
    slug: "returns-exchange",
    title: "Return & Exchange Policy",
    navLabel: "Returns & exchange",
    metaDescription:
      "Return and exchange terms for Hajar by Nazish Ali — made-to-order pieces, ready-to-wear exchanges, damaged or incorrect items, and international orders.",
    intro:
      "At Hajar by Nazish Ali, every piece is created with great attention to detail, craftsmanship, and quality. We encourage our customers to carefully review the product description, size chart, and order details before confirming a purchase.",
    sections: [
      {
        heading: "Made-to-order & customized items",
        blocks: [
          p("As our made-to-order and customized pieces are specially prepared according to each customer's order, they are not eligible for return, exchange, or refund once the order has been confirmed."),
          p("This includes:"),
          list([
            "Made-to-order outfits",
            "Customized measurements or sizing",
            "Customized colors, lengths, or design details",
            "Any item altered specifically at the customer's request",
          ]),
          p("Once production has started, an order cannot be cancelled or modified."),
        ],
      },
      {
        heading: "Ready-to-wear items",
        blocks: [
          p("Ready-to-wear items may be eligible for an exchange in case of a size issue, subject to stock availability. To request an exchange, please contact us within 48 hours of receiving your order."),
          p("The item must:"),
          list([
            "Be unworn and unused",
            "Be in its original condition",
            "Have all original tags attached",
            "Be free from perfume, makeup, stains, damage, or alterations",
            "Be returned in its original packaging",
          ]),
          p("Customers are responsible for return shipping/courier charges for size exchanges."),
        ],
      },
      {
        heading: "Damaged or incorrect items",
        blocks: [
          p("Every order is carefully inspected before dispatch. However, if you receive an incorrect item or an item with a manufacturing defect, please contact us within 48 hours of delivery."),
          p("Please provide your order number along with clear photos and an unedited unboxing video showing the issue."),
          p("Once reviewed and approved by our team, we will arrange an appropriate solution, which may include repair, replacement, exchange, or refund depending on the circumstances."),
          p("Minor variations in embroidery, handwork, embellishment placement, fabric texture, or color are not considered defects. Due to lighting, photography, and different screen displays, actual colors may vary slightly from the images shown on our website."),
        ],
      },
      {
        heading: "Sale & discounted items",
        blocks: [
          p("Items purchased during a sale, promotion, or at a discounted price are final sale and cannot be returned, exchanged, or refunded unless an incorrect or defective item has been delivered."),
        ],
      },
      {
        heading: "International orders",
        blocks: [
          p("International orders are not eligible for return or exchange due to sizing or change of mind. If an incorrect or defective item is received, please contact us within 48 hours of delivery with your order details, photographs, and an unedited unboxing video."),
          p("Any customs duties, taxes, or import charges imposed by the destination country are the responsibility of the customer."),
        ],
      },
    ],
    acknowledgement:
      "By placing an order with Hajar by Nazish Ali, the customer acknowledges and agrees to this Return & Exchange Policy.",
  },

  /* ------------------------------------------------------- Payment */
  {
    slug: "payment",
    title: "Payment Policy",
    navLabel: "Payment",
    metaDescription:
      "Payment terms for Hajar by Nazish Ali — 50% advance on made-to-order pieces, ready-to-wear orders, payment methods, verification and pricing.",
    intro:
      "At Hajar by Nazish Ali, orders are processed after the required payment has been received and confirmed.",
    sections: [
      {
        heading: "Made-to-order & custom orders",
        blocks: [
          p("For made-to-order and customized outfits, a 50% advance payment is required to confirm the order and begin production."),
          p("The remaining 50% balance must be paid before dispatch."),
          p("An order will only be considered confirmed once the advance payment has been received. Because production begins specifically for the customer after confirmation, advance payments for made-to-order or customized pieces are non-refundable once production has started."),
        ],
      },
      {
        heading: "Ready-to-wear orders",
        blocks: [
          p("Full payment may be required at the time of placing an order for ready-to-wear pieces, depending on the selected payment method and delivery location."),
        ],
      },
      {
        heading: "Payment methods",
        blocks: [
          p("Available payment options will be displayed at checkout or communicated by our customer service team when placing an order directly. Customers making a bank transfer or other manual payment may be required to provide proof of payment for verification."),
        ],
      },
      {
        heading: "International orders",
        blocks: [
          p("International orders require payment in advance before the order is processed or dispatched. International customers are responsible for any applicable customs duties, import taxes, or other charges imposed by their destination country. These charges are not included in the product or shipping price unless specifically stated otherwise."),
        ],
      },
      {
        heading: "Order confirmation",
        blocks: [
          p("Submitting an order request does not guarantee confirmation. An order is considered confirmed only after the required payment has been successfully received and verified by Hajar by Nazish Ali."),
          p("For made-to-order pieces, the estimated production and delivery timeline begins after payment confirmation and finalization of all required measurements and customization details."),
        ],
      },
      {
        heading: "Payment verification",
        blocks: [
          p("For the security of our customers and our business, Hajar by Nazish Ali reserves the right to verify payment details before processing an order. If payment cannot be verified, the order may be placed on hold until verification is completed."),
        ],
      },
      {
        heading: "Pricing",
        blocks: [
          p("All prices displayed on our website are subject to change without prior notice. However, once an order has been confirmed and the required payment received, the confirmed price of that order will not change unless the customer requests additional customization or alterations that result in additional charges."),
        ],
      },
    ],
    acknowledgement:
      "By placing an order with Hajar by Nazish Ali, the customer acknowledges and agrees to this Payment Policy.",
  },

  /* -------------------------------------------- Shipping & delivery */
  {
    slug: "shipping-delivery",
    title: "Shipping & Delivery Policy",
    navLabel: "Shipping & delivery",
    metaDescription:
      "Shipping and delivery times for Hajar by Nazish Ali — 5–6 weeks within Pakistan and 6–7 weeks internationally for made-to-order pieces, plus charges and tracking.",
    intro:
      "At Hajar by Nazish Ali, we take great care in preparing, inspecting, and packaging every order before dispatch.",
    sections: [
      {
        heading: "Made-to-order delivery time",
        blocks: [
          p("Most of our formal and luxury pieces are made to order and require time for detailed craftsmanship, handwork, finishing, and quality inspection."),
          p("Estimated delivery timelines are:"),
          list([
            "Pakistan: Approximately 5–6 weeks after order confirmation.",
            "International: Approximately 6–7 weeks after order confirmation.",
          ]),
          p("The estimated timeline begins once the required advance payment has been received and all measurements, sizing, and customization details have been finalized."),
          p("If you require an outfit for a specific event or date, please contact our team before placing your order so we can advise you regarding availability and production time."),
        ],
      },
      {
        heading: "Ready-to-wear orders",
        blocks: [
          p("Ready-to-wear pieces may be dispatched sooner than made-to-order pieces. The estimated dispatch or delivery timeframe will be communicated at the time of ordering where applicable."),
        ],
      },
      {
        heading: "Shipping charges",
        blocks: [
          p("Shipping charges may vary depending on the destination, package size, and courier service. Any applicable shipping charges will be displayed at checkout or communicated before the order is confirmed."),
        ],
      },
      {
        heading: "International shipping",
        blocks: [
          p("We offer international shipping to selected destinations. International customers are responsible for any customs duties, import taxes, VAT, clearance fees, or other charges imposed by their destination country."),
          p("These charges are not included in the product price or shipping fee unless specifically stated otherwise. Hajar by Nazish Ali is not responsible for delays caused by customs clearance procedures in the destination country."),
        ],
      },
      {
        heading: "Delivery delays",
        blocks: [
          p("While we make every effort to meet the estimated delivery timeframe, delays may occasionally occur due to circumstances beyond our reasonable control, including courier delays, customs clearance, public holidays, adverse weather conditions, or other unforeseen circumstances."),
          p("Where a production-related delay occurs, our team will make reasonable efforts to keep the customer informed."),
        ],
      },
      {
        heading: "Shipping information",
        blocks: [
          p("Customers are responsible for providing complete and accurate shipping information. Please carefully check your:"),
          list([
            "Full name",
            "Contact number",
            "Complete delivery address",
            "City, postal code, and country",
          ]),
          p("Hajar by Nazish Ali will not be responsible for delays or additional shipping charges resulting from incorrect or incomplete information provided by the customer."),
        ],
      },
      {
        heading: "Order tracking",
        blocks: [
          p("Where tracking is available, tracking details will be provided once the order has been dispatched."),
        ],
      },
    ],
  },

  /* --------------------------------------------------- Cancellation */
  {
    slug: "cancellation",
    title: "Cancellation Policy",
    navLabel: "Cancellation",
    metaDescription:
      "Cancellation terms for Hajar by Nazish Ali — when a made-to-order or ready-to-wear order can be cancelled, and how to request a cancellation.",
    intro:
      "At Hajar by Nazish Ali, many of our pieces are individually made to order. Materials, craftsmanship, embellishment work, and production arrangements may begin shortly after an order is confirmed.",
    sections: [
      {
        heading: "Made-to-order & customized orders",
        blocks: [
          p("A made-to-order or customized order may only be cancelled before production has started."),
          p("Once production, customization, embroidery, embellishment, cutting, stitching, or sourcing specifically for your order has begun, the order cannot be cancelled and the advance payment is non-refundable."),
        ],
      },
      {
        heading: "Order changes",
        blocks: [
          p("If you need to request a change to your size, measurements, color, length, or other order details, please contact us as soon as possible. Changes cannot be guaranteed once production has started."),
          p("Where a requested change can be accommodated but results in additional production costs, the customer may be required to pay an additional customization charge."),
        ],
      },
      {
        heading: "Ready-to-wear orders",
        blocks: [
          p("Cancellation requests for ready-to-wear orders must be made before the order has been dispatched. Once an order has been dispatched, it cannot be cancelled."),
        ],
      },
      {
        heading: "Cancellation by Hajar by Nazish Ali",
        blocks: [
          p("In the rare event that we are unable to fulfil a confirmed order, the customer will be contacted and offered an appropriate solution. If we cancel an order that has already been paid for and no replacement or alternative is accepted, the applicable amount paid for the cancelled item will be refunded."),
        ],
      },
      {
        heading: "How to request a cancellation",
        blocks: [
          p("Please contact us as soon as possible and provide your order number and contact details."),
          p("Submitting a cancellation request does not automatically mean that the cancellation has been accepted. Our team will first confirm whether production or dispatch has already begun."),
        ],
      },
    ],
  },

  /* ------------------------------------------------ Terms & conditions */
  {
    slug: "terms",
    title: "Terms & Conditions",
    navLabel: "Terms & conditions",
    metaDescription:
      "Terms and conditions for Hajar by Nazish Ali — products and craftsmanship, sizing, pricing, order acceptance, intellectual property and liability.",
    intro:
      "Welcome to Hajar by Nazish Ali. By accessing our website, placing an order, or purchasing our products, you agree to these Terms & Conditions together with our Payment, Shipping & Delivery, Return & Exchange, Cancellation, and Privacy Policies.",
    sections: [
      {
        heading: "Products & craftsmanship",
        blocks: [
          p("Hajar by Nazish Ali offers fashion pieces that may include handcrafted embroidery, embellishments, beadwork, and other artisanal techniques."),
          p("Due to the handcrafted nature of our products, slight variations in embroidery, embellishment placement, finishing, or detailing may occur. Such minor variations are part of the individual character of handcrafted garments and are not necessarily considered defects."),
        ],
      },
      {
        heading: "Colors & product images",
        blocks: [
          p("We make reasonable efforts to represent our products accurately. However, colors may appear slightly different due to photography, lighting conditions, editing, screen settings, and device displays."),
        ],
      },
      {
        heading: "Sizing & measurements",
        blocks: [
          p("Customers are responsible for selecting the correct size and providing accurate measurements for customized orders. We recommend reviewing our size chart carefully before placing an order."),
          p("For customized pieces, Hajar by Nazish Ali will produce the garment based on the measurements supplied or approved by the customer."),
        ],
      },
      {
        heading: "Pricing",
        blocks: [
          p("Prices are displayed on our website and may be changed without prior notice. The price applicable to an order is generally the price confirmed when the order and required payment are accepted. Additional customization requested by the customer may result in additional charges."),
        ],
      },
      {
        heading: "Order acceptance",
        blocks: [
          p("Placing an order or submitting an order request does not automatically constitute acceptance by Hajar by Nazish Ali."),
          p("We reserve the right to decline or cancel an order where reasonably necessary, including in cases of pricing errors, product/material unavailability, suspected fraudulent transactions, or circumstances preventing us from fulfilling the order."),
        ],
      },
      {
        heading: "Made-to-order products",
        blocks: [
          p("Made-to-order and customized products are created specifically for individual customers. Once production has started, such orders cannot normally be cancelled, returned, exchanged, or refunded except where required by applicable law or where an eligible manufacturing defect or incorrect item has been confirmed under our Return & Exchange Policy."),
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          p("All original content displayed by Hajar by Nazish Ali, including original designs, photographs, videos, graphics, logos, branding, written content, and other creative material, is owned by or licensed to Hajar by Nazish Ali, subject to applicable intellectual-property rights."),
          p("Our content may not be copied, reproduced, commercially distributed, or used to represent another business without authorization."),
        ],
      },
      {
        heading: "Promotional codes & offers",
        blocks: [
          p("Promotional offers, discounts, and codes may be subject to specific terms and validity periods. Hajar by Nazish Ali reserves the right to modify or discontinue promotional offers where permitted by applicable law."),
        ],
      },
      {
        heading: "Liability",
        blocks: [
          p("We are not responsible for delays or failure to perform caused by circumstances reasonably beyond our control, including courier disruptions, customs delays, severe weather, natural disasters, government restrictions, or other force-majeure events."),
          p("Nothing in these Terms & Conditions is intended to exclude or limit any rights or remedies that cannot legally be excluded under applicable law."),
        ],
      },
      {
        heading: "Policy updates",
        blocks: [
          p("Hajar by Nazish Ali may update these Terms & Conditions and related website policies from time to time. The version displayed on our website at the relevant time will apply, subject to applicable law."),
        ],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return POLICIES.find((policy) => policy.slug === slug);
}
