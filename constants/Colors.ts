/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',           // Color del texto principal en modo claro
    background: '#fff',        // Fondo en modo claro
    tint: tintColorLight,      // Color de acento (azul: #0a7ea4)
    icon: '#687076',           // Color de iconos en modo claro
    tabIconDefault: '#687076', // Icono de pestaña (no seleccionado)
    tabIconSelected: tintColorLight, // Icono de pestaña (seleccionado)
  },
  dark: {
    text: '#ECEDEE',           // Color del texto principal en modo oscuro
    background: '#151718',     // Fondo en modo oscuro
    tint: tintColorDark,       // Color de acento (blanco: #fff)
    icon: '#9BA1A6',           // Color de iconos en modo oscuro
    tabIconDefault: '#9BA1A6', // Icono de pestaña (no seleccionado)
    tabIconSelected: tintColorDark, // Icono de pestaña (seleccionado)
  },
};
