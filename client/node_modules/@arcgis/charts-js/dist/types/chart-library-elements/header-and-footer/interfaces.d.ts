import { WebChartText } from "@arcgis/charts-spec";
import { Container, Label } from "@amcharts/amcharts4/core";
export interface HeaderProps {
    title?: WebChartText;
    subTitle?: WebChartText;
}
export interface HeaderElements {
    title: Label;
    subTitle: Label;
    headerContainer: Container;
}
export interface FooterElements {
    footer: Label;
    footerContainer: Container;
}
