import { type Theme } from '../create-theme';
import { type ComponentsVarsOverridesJson, type ComponentsStyleOverrides, type ComponentsOverrides, type ComponentOverridesRules } from './overrides';
export interface ThemeComponents<T = Theme> extends ComponentsOverrides<T> {
}
export type { ComponentOverridesRules };
export interface ThemeCompOptions extends ThemeComponents<Theme> {
}
export interface ThemeVariableCompOptions extends ComponentsVarsOverridesJson {
}
export type ThemeStylesOptions<T = Theme> = ComponentsStyleOverrides<T>;
export * from './overrides';
