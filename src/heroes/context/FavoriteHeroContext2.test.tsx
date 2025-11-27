import { use } from "react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Hero } from "../types/hero.interface";


const mockHero = {
    id: '1',
    name: 'batman',
} as Hero;

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestComponent = () => {
    const { favoriteCount, favorites, isFavorite, toggleFavorite } = use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid='favorite-count'>{favoriteCount}</div>
            <div data-testid='favorite-list'>
                {favorites.map(hero => (
                    <div key={hero.id} data-testid={`hero-${hero.id}`}>
                        {hero.name}
                    </div>
                ))}
            </div>

            <button data-testid='toggle-favorite'
                onClick={() => toggleFavorite(mockHero)}>Toggle Favorite</button>
            {/* COn el toString nos aseguramos de que renderiza el true o false */}
            <div data-testid='is-favorite'>{isFavorite(mockHero).toString()}</div>
        </div>
    );
};

const renderContextTest = () => {

    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    );
}

describe('FavoriteHeroContext', () => {
    //CAda vez que utilicemos algun mock o vi function de vitest es necesario limpiar
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should inicialize with default values', () => {
        //Con esta instrucción se renderiza el contexto
        renderContextTest();
        // screen.debug(); 
        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    });

    test('should add hero to favorites when toggleFavorite is called with new hero', () => {
        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');
        //Se simula el click con fireEvent
        fireEvent.click(button);   //Se guarda en favoritos  

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'favorites', '[{"id":"1","name":"batman"}]'
        );
    });

    test('should remove hero to favorites when toggleFavorite is called', () => {
        //La diverencia entre usar el mockReturnValue es que el return es para funciones tradicionales y el 
        // mockResultValue es para promesas
        localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');
        //Se simula el click con fireEvent
        fireEvent.click(button);   //Se guarda en favoritos
        screen.debug();

        console.log(localStorage.getItem('favorites'));
        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero-1')).toBeNull();

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]');
    });
});