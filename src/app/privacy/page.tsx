import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Dalal Streett.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
        <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            At Dalal Streett, accessible from https://dalalstreett-77pt.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Dalal Streett and how we use it.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">Log Files</h2>
          <p>
            Dalal Streett follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">Cookies and Web Beacons</h2>
          <p>
            Like any other website, Dalal Streett uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
