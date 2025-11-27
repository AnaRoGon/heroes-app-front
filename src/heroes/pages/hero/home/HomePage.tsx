import { useSearchParams } from "react-router"
import { use, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"

export const HomePage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') ?? 'all';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];

        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab]);

    const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);

    const { data: summary } = useHeroSummary();

    const { favoriteCount, favorites } = use(FavoriteHeroContext);

    return (
        <>
            <>
                {/* Header */}
                <CustomJumbotron
                    title="Búsqueda de SuperHéroes"
                    description="Descubre, explora y administra super héroes y villanos" />

                {/* CustomBreadcrumbs */}
                <CustomBreadcrumbs currentPage="Súper Héroes" />

                {/* Stats Dashboard */}
                <HeroStats />

                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'all');
                            prev.set('category', 'all');
                            prev.set('page', '1');
                            return prev;
                        })
                        }
                        >
                            All Characters ({summary?.totalHeroes})
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center gap-2"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                return prev;
                            })
                            }>
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger value="heroes"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })
                            }>Heroes ({summary?.heroCount})</TabsTrigger>
                        <TabsTrigger value="villains" onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'villains');
                            prev.set('category', 'villain');
                            prev.set('page', '1');
                            return prev;
                        })
                        }>Villains ({summary?.villainCount})</TabsTrigger>
                    </TabsList>

                    {/* Show the content indicated in the selected tab */}
                    <TabsContent value='all'>
                        {/* Mostrar todos los personajes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value='favorites'>
                        {/* Mostrar todos los personajes favoritos*/}
                        <HeroGrid heroes={favorites ?? []} />
                        {/* <HeroGrid /> */}
                    </TabsContent>
                    <TabsContent value='heroes'>
                        {/* Mostrar todos los héroes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                        {/* <HeroGrid /> */}
                    </TabsContent>

                    <TabsContent value='villains'>
                        {/* Mostrar todos los héroes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                        {/* <HeroGrid /> */}
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                {selectedTab !== 'favorites' && (<CustomPagination totalPages={heroesResponse?.pages ?? 1} />)}

            </>
        </>
    )
}
