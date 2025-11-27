import { describe, expect, test } from "vitest";
import { getHeroAction } from './get-hero.action';


describe('getHeroAction', () => {

    test('Should fecth hero result and return with complete image url', async () => {
        const searchidSlugExample = 'bruce-wayne';

        const result = await getHeroAction(searchidSlugExample);
        const resultImageUrl = result.image;
        // console.log(result);
        expect(resultImageUrl).toContain('http');
        expect(result).toStrictEqual({
            id: '2',
            name: 'Bruce Wayne',
            slug: 'bruce-wayne',
            alias: 'Batman',
            powers: [
                'Artes marciales',
                'Habilidades de detective',
                'Tecnología avanzada',
                'Sigilo',
                'Genio táctico'
            ],
            description: 'El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.',
            strength: 6,
            intelligence: 10,
            speed: 6,
            durability: 7,
            team: 'Liga de la Justicia',
            image: 'http://localhost:3001/images/2.jpeg',
            firstAppearance: '1939',
            status: 'Active',
            category: 'Hero',
            universe: 'DC'
        });

    });

    test('Should throw an error if hero is not found', async () => {

        const idSlug = 'notAHero';
        const result = await getHeroAction(idSlug).catch((error) => {
            console.log('Error obteniendo datos del héroe');
            console.log(error.message);
            expect(error).toBeDefined();
            expect(error.message).toBe('Request failed with status code 404');
        });

        expect(result).toBeUndefined();

    });
}); 