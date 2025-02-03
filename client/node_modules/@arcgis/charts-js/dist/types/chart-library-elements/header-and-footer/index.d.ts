import { Container } from "@amcharts/amcharts4/core";
import { WebChartText } from "@arcgis/charts-spec";
import { HeaderProps, HeaderElements, FooterElements } from "./interfaces";
export declare function initializeHeaderContainer(parent: Container): HeaderElements;
export declare function updateHeaderContainer(headerElements: HeaderElements, props?: HeaderProps): void;
export declare function initializeFooterContainer(parent: Container): FooterElements;
export declare function updateFooterContainer(footerElements: FooterElements, props?: WebChartText): void;
