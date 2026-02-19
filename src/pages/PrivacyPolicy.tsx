import type { FC } from 'react';

const PrivacyPolicy: FC = () => {
    return (
        <div className="w-full h-full overflow-y-auto bg-white">
            <div className="container mx-auto p-8 max-w-4xl text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy – FH Aging AR Web Experience</h1>
                <p className="mb-4 text-sm text-gray-500 text-center">Last updated: 19 February 2026</p>

                <section className="mb-6">
                    <p>
                        This Privacy Policy explains how the FH Aging AR Web Experience (“the App”, “we”, “our”) handles information when you use the web-based augmented reality experience powered by Snap Camera Kit Web SDK.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
                    <p className="mb-2">
                        The App is an interactive web experience that allows users to enter an age range and optionally enable a camera-based augmented reality (AR) aging effect with informational overlays about FH’s support for seniors.
                    </p>
                    <p>
                        We are committed to protecting user privacy and minimizing data collection.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">2. Camera Access and AR Processing</h2>
                    <p className="mb-2">If you choose to enable the AR feature:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>The App will request permission to access your device camera.</li>
                        <li>Camera access is used only to render real-time AR effects.</li>
                        <li>All camera processing occurs locally on your device through the Snap Camera Kit Web SDK.</li>
                        <li>We do not record, store, or upload video or images from your camera to our servers.</li>
                        <li>You can deny or revoke camera permission at any time through your browser settings.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">3. Photos and Media</h2>
                    <p className="mb-2">If the App includes a capture feature:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Any photo or image generated is saved locally on your device.</li>
                        <li>We do not receive, store, or transmit captured images.</li>
                        <li>We do not maintain a photo database.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">4. Personal Data</h2>
                    <p className="mb-2">The App does not require account creation and does not collect personally identifiable information.</p>
                    <p className="mb-2">The only optional input is:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>An age value or age range entered by the user</li>
                    </ul>
                    <p className="mt-2">
                        This value is used only to adjust the visual AR effect and informational content in real time and is not stored or transmitted.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">5. Analytics and Technical Data</h2>
                    <p className="mb-2">We may collect limited anonymous technical data to ensure the experience functions correctly, such as:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Browser type</li>
                        <li>Device type</li>
                        <li>General usage events (e.g., page load)</li>
                    </ul>
                    <p className="mt-2">
                        This data does not identify individual users and is used only for performance and stability improvements.
                    </p>
                    <p className="mt-2">
                        If analytics tools are used, they operate in a privacy-respecting, aggregated manner.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
                    <p className="mb-2">The App uses the Snap Camera Kit Web SDK, provided by Snap Inc., to power AR functionality.</p>
                    <p className="mb-2">When the AR feature is active:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Camera processing occurs locally on the device.</li>
                        <li>Snap’s SDK may process data required to render lenses and effects.</li>
                        <li>No camera media is stored by us.</li>
                    </ul>
                    <p className="mt-2">
                        For more information, please refer to: <br />
                        <a href="https://values.snap.com/privacy/privacy-policy?lang=en-US  " target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Snap Privacy Policy: https://values.snap.com/privacy/privacy-policy?lang=en-US
                        </a>
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">7. Data Storage</h2>
                    <p className="mb-2">We do not maintain servers that store:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Camera images or video</li>
                        <li>Entered age values</li>
                        <li>Biometric or facial recognition data</li>
                    </ul>
                    <p className="mt-2">Any processing occurs in real time and is not retained.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">8. Children’s Privacy</h2>
                    <p className="mb-2">This experience is intended for general audiences and informational use.</p>
                    <p>We do not knowingly collect personal data from children.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">9. Security</h2>
                    <p>
                        Because media processing occurs locally on the device and we do not store personal data, risks related to data storage are minimized. We implement reasonable technical measures to keep the website secure.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">10. Your Choices</h2>
                    <p className="mb-2">You can:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>Deny camera permissions</li>
                        <li>Leave the page at any time</li>
                        <li>Clear local browser storage if used by your device</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy to reflect changes to the App or legal requirements. Updates will be posted on this page with a revised date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
                    <p className="mb-1">For questions about this Privacy Policy or the App:</p>
                    <p className="font-medium">Organization: Fagbevægelsens Hovedorganisation (FH)</p>
                    <p>
                        Website: <a href="https://fho.dk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://fho.dk</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
