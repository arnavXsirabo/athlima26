import HeroLayer from '@/components/home/HeroLayer';
import EditorialIntro from '@/components/home/EditorialIntro';
import InteractiveSports from '@/components/home/InteractiveSports';
import VisualStory from '@/components/home/VisualStory';
import RegistrationCTA from '@/components/home/RegistrationCTA';

export default function Home() {
  return (
    <>
      <HeroLayer />
      <EditorialIntro />
      <InteractiveSports />
      <VisualStory />
      <RegistrationCTA />
    </>
  );
}
