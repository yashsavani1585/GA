import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const termsData = [
  {
    title: "Use of the Website",
    content:
      "By accessing the website, you warrant and represent to the website owner that you are legally entitled to do so and to make use of information made available via the website, call centre or any other means of communication."
  },
  {
    title: "Definition",
    content:
      '“Jewellery” means the jewellery that is predesigned or jewellery set with gold and lab grown diamonds that are available for sale on our website/ retail stores. Please note that all Jewellery is sold on “as is” basis. “Mounts” are defined as designs that hold a diamond(s) in place, which may or may not have diamonds. Members can select Mounts and diamonds separately to create customized Jewellery. “Loose Diamonds” are individual diamonds that can be bought without being set on Mounts.'
  },
  {
    title: "Trademarks",
    content:
      "The trademarks, names, logos and service marks (collectively “trademarks”) displayed on this website are registered and unregistered trademarks of the website owner. Nothing contained on this website should be construed as granting any license or right to use any trademark without the prior written permission of the website owner."
  },
  {
    title: "External links",
    content:
      "External links may be provided for your convenience, but they are beyond the control of the website owner and no representation is made as to their content. Use or reliance on any external links and the content thereon provided is at your own risk."
  },
  {
    title: "Warranties",
    content:
      "The website owner makes no warranties, representations, statements or guarantees (whether express, implied in law or residual) regarding the website."
  },
  {
    title: "Prices",
    content: `Our pricing is calculated using current precious metal and gem prices to give you the best possible value. These prices do change from time to time, owing to the fluctuations in prices of precious metal and diamond prices, so our prices change as well. The pricing of the metal on the day of purchase/ advance payment will be considered in pricing for customer.

Prices on Jewelbox.co.in / Jewelbox Store are subject to change without notice. Please expect to be charged the price for the Jewelbox.co.in / Jewelbox Store merchandise you buy as it is listed on the day of purchase.

Pricing may change slightly due to variance between metal and diamond estimate provided on website and the actual finished product. Such increase/ decrease would be collected/ refunded to the customer at the time of final sale.`
  },
  {
    title: "Other Information",
    content:
      `This Website provides access to trading, pricing, news and other information services related to diamonds and jewellery. Certain Services available on this Website are for the use of Members only. This Website offers services for Members who wish to purchase diamonds / jewellery for personal consumption, inclusive of, customized and readymade Jewellery.

Some items may appear slightly larger or smaller than actual size due to screen defaults and photography techniques. Sometimes the items may be represented larger than the actual size in order to clearly show details or smaller than the actual size in order to show the entire item. The Company shall not be liable for any legal action on this account.`
  },
  {
    title: "Disclaimer of liability",
    content:
      `The website owner shall not be responsible for and disclaims all liability for any loss, liability, damage (whether direct, indirect or consequential), personal injury or expense of any nature whatsoever which may be suffered by you or any third party (including your company), as a result of or which may be attributable, directly or indirectly, to your access and use of the website, any information contained on the website, your or your company’s personal information or material and information transmitted over our system. In particular, neither the website owner nor any third party or data or content provider shall be liable in any way to you or to any other person, firm or corporation whatsoever for any loss, liability, damage (whether direct or consequential), personal injury or expense of any nature whatsoever arising from any delays, inaccuracies, errors in, or omission of any share price information or the transmission thereof, or for any actions taken in reliance thereon or occasioned thereby or by reason of non-performance or interruption, or termination thereof.

We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.

`
  },
  {
    title: "Conflict of terms",
    content:
      "If there is a conflict or contradiction between the provisions of these website terms and conditions and any other relevant terms and conditions, policies or notices, the other relevant terms and conditions, policies or notices which relate specifically to a particular section or module of the website shall prevail in respect of your use of the relevant section or module of the website."
  },
  {
    title: "Severability",
    content:
      "Any provision of any relevant terms and conditions, policies and notices, which is or becomes unenforceable in any jurisdiction, whether due to being void, invalidity, illegality, unlawfulness or for any reason whatever, shall, in such jurisdiction only and only to the extent that it is so unenforceable, be treated as void and the remaining provisions of any relevant terms and conditions, policies and notices shall remain in full force and effect"
  },
  {
    title: "Cancellation & Returns",
    content:
      `Refunds will be made for any cancelled orders. Orders cancelled within 24 hours of placing the order are entitled for full refund subject to deduction of payment gateway charges of 1%. Orders canceled 24 hours after placing the order will lead to a Processing Charge of Rs. 1000 that will be borne by the customer along with 1% payment gateway charges.

However if the order is customised and is made as per customers order, making charges would be charged and forfeited. You can cancel one order item within an order without cancelling the entire order if the order contains 2 or more order items.

· For prepaid orders, the amount will be credited to the payment source (Credit Card/Debit Card /Net Banking).

Once the product is returned under our 15 Day Money Back policy (not applicable on coins) the refund will be credited to your account. You may choose to either make another purchase using the same or get the amount refunded to your bank account.

For cash on delivery orders, the refund will be processed to your bank account.

· For prepaid orders, the amount will be credited to the payment source (Credit Card/Debit Card/Net Banking).

· Upon cancellation/ return of orders placed using gift cards, the gift card amount will be refunded back to the gift card.

· Please visit https://www.jewelbox.co.in /shipping-return.html for more details about our Returns Policy.`
  },
  {
    title: "Applicable laws",
    content:
      `Use of this website shall in all respects be governed by the laws of the state of West Bengal, India, regardless of the laws that might be applicable under principles of conflicts of law. The parties agree that the courts located in India country, West Bengal, shall have exclusive jurisdiction over all controversies arising under this agreement and agree that venue is proper in those courts.

As per the current guidelines mandated by the Government of India, a customer has to provide the Permanent Account Number (PAN) for all purchases above INR 2 lakh in a day.`


  },
  {
    title: "Free Gift",
    content:
      `All free gifts are treated as discounts.

· In Case of Partial Cancellation or Returns of Orders with a Free gift, the Amount refunded will not include the discount attributed to the Free Gift.

`
  },
  {
    title: "Offer Terms & Conditions",
    content:
      `· Special offer is valid only on select designs on jewellery.

· Jewelbox.co.in / Jewelbox Store may change (add to, delete, or amend) these terms from time to time.

· All disputes, with respect to the products and services offered in this connection, are subject to Kolkata jurisdiction.

`
  }
];

const TermsAndConditions = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-12 px-6 md:px-20 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
          TERMS AND CONDITIONS
        </h1>

        {/* Intro Text */}
        <p className="text-gray-700 mb-6">
          Welcome to Crystova. These Terms and Conditions (“Terms”) apply to your access
          and use of the Crystova website, mobile application, and services (collectively,
          the “Platform”). By accessing or using our Platform, you agree to be bound by
          these Terms. If you do not agree, you should not use the Platform.
        </p>

        <p className="text-gray-700 mb-8">
          Crystova is committed to providing a seamless and secure shopping experience,
          and these Terms are designed to ensure transparency, trust, and mutual
          understanding between you, the user, and our company. Whether you are browsing
          our collections, making a purchase, participating in a promotional offer, or
          submitting feedback, these conditions outline your rights and obligations.
        </p>

        {/* Accordion Section */}
        <div className="space-y-4">
          {termsData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 focus:outline-none"
                onClick={() => toggleSection(index)}
              >
                {item.title}
                {openIndex === index ? (
                  <FaMinus className="text-black" />
                ) : (
                  <FaPlus className="text-black" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
