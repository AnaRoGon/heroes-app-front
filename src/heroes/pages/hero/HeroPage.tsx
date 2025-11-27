import { HeroProfile } from '@/heroes/components/HeroProfile';
import { useParams } from 'react-router'



export const HeroPage = () => {
    const idSlug = useParams();

    console.log({ idSlug });

    return (
        <HeroProfile />
    )
}
