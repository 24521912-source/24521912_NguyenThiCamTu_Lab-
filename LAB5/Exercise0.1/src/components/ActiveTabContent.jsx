import { useAppState } from '../context/useAppState.js';

const tabContent = {
  reels: {
    title: 'Reels',
    description:
      'This view demonstrates the default active tab.',
    symbol: 'R',
  },
  overview: {
    title: 'Overview',
    description:
      'This view demonstrates navigation through reducer actions.',
    symbol: 'O',
  },
};

export default function ActiveTabContent() {
  const { activeTab } = useAppState();

  const content = tabContent[activeTab];

  return (
    <section
      className="content-card"
      aria-labelledby="active-content-title"
    >
      <div
        className="content-symbol"
        aria-hidden="true"
      >
        {content.symbol}
      </div>

      <h2 id="active-content-title">
        {content.title}
      </h2>

      <p>{content.description}</p>
    </section>
  );
}