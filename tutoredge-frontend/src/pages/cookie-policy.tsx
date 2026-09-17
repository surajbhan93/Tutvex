import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { Cookie, Shield, BarChart3, Settings, Target, Calendar } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <>
      <Head>
        <title>Cookie Policy | Tutvex - How We Use Cookies</title>
        <meta
          name="description"
          content="Learn about how Tutvex uses cookies to improve your experience and protect your privacy."
        />
      </Head>

      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Cookie className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white">Cookie Policy</h1>
            <p className="text-lg text-blue-100">
              How Tutvex uses cookies to enhance your experience
            </p>
            <p className="mt-2 text-sm text-blue-200">
              Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Introduction */}
          <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">What Are Cookies?</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences,
              understanding how you use our site, and enabling certain features.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies (like web beacons, pixels, and local storage) to
              enhance your browsing experience, analyze site traffic, personalize content, and deliver
              relevant advertising.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>

            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Necessary Cookies</h3>
                    <span className="text-xs text-gray-500">Always Active</span>
                  </div>
                </div>
                <p className="mb-3 text-gray-600">
                  These cookies are essential for the website to function properly. They enable basic
                  features like page navigation, access to secure areas, and authentication. The
                  website cannot function properly without these cookies.
                </p>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Session authentication cookies</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                    <span className="text-xs text-gray-500">Optional - Requires Consent</span>
                  </div>
                </div>
                <p className="mb-3 text-gray-600">
                  These cookies help us understand how visitors interact with our website by
                  collecting and reporting information anonymously. This helps us improve our website
                  and services.
                </p>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Google Analytics - page views, session duration</li>
                    <li>Heatmap tracking - user behavior analysis</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                    <span className="text-xs text-gray-500">Optional - Requires Consent</span>
                  </div>
                </div>
                <p className="mb-3 text-gray-600">
                  These cookies enable enhanced functionality and personalization, such as
                  remembering your preferences, language settings, and providing personalized
                  content.
                </p>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Language and region preferences</li>
                    <li>User interface customization</li>
                    <li>Video player settings</li>
                  </ul>
                </div>
              </div>

              {/* Advertising Cookies */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Advertising Cookies</h3>
                    <span className="text-xs text-gray-500">Optional - Requires Consent</span>
                  </div>
                </div>
                <p className="mb-3 text-gray-600">
                  These cookies are used to deliver advertisements that are relevant to you and your
                  interests. They may also be used to measure the effectiveness of advertising
                  campaigns.
                </p>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Targeted advertising and remarketing</li>
                    <li>Ad performance measurement</li>
                    <li>Third-party advertising platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How Long Cookies Last */}
          <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div className="mb-4 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">How Long Do Cookies Last?</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong className="text-gray-900">Session Cookies:</strong> These are temporary
                cookies that expire when you close your browser.
              </p>
              <p>
                <strong className="text-gray-900">Persistent Cookies:</strong> These cookies remain
                on your device for a set period or until you delete them. We use persistent cookies
                to remember your preferences and settings.
              </p>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              How to Manage Your Cookie Preferences
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You have full control over your cookie preferences. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accept or reject cookies through our cookie consent banner</li>
                <li>Customize your preferences for different cookie categories</li>
                <li>Change your settings at any time through your browser</li>
                <li>Delete cookies that have already been set</li>
              </ul>
              <p className="mt-4">
                Please note that blocking certain cookies may impact your experience and some
                features may not function properly.
              </p>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Third-Party Cookies</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              We work with trusted third-party service providers who may also set cookies on your
              device when you visit our website. These may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Google Analytics (website analytics)</li>
              <li>Google Tag Manager (tag management)</li>
              <li>Meta Pixel (advertising and analytics)</li>
              <li>Microsoft Clarity (user behavior analytics)</li>
            </ul>
            <p className="mt-4 text-gray-600">
              These third parties have their own privacy policies and cookie policies, which we
              encourage you to review.
            </p>
          </section>

          {/* Updates */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Updates to This Policy</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for legal, regulatory, or operational reasons. We encourage you to review this page
              periodically to stay informed about how we use cookies.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">Questions About Our Cookie Policy?</h2>
            <p className="mb-6 text-blue-100">
              If you have any questions about how we use cookies or this Cookie Policy, please don't
              hesitate to contact us.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
