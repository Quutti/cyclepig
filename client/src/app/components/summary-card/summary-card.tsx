import * as React from "react";
import * as colorUtils from "../../utils/colors";
import { Card } from "qruut";

const styles: any = require("./summary-card.css");

interface OwnProps {
    label: string;
    value: string;
    backgroundColor: string;
    textColor?: string;
    icon?: string;
}

export class SummaryCard extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const { label, value, textColor, backgroundColor, icon } = this.props;

        const style: any = {};
        if (textColor) {
            style.color = textColor;
        } else {
            style.color = colorUtils.isDarkColor(backgroundColor) ? "#fff" : "#333";
        }

        const iconClasses = (icon)
            ? [styles.icon, "fa", `fa-${icon}`].join(" ")
            : "";

        return (
            <Card style={{ backgroundColor: this.props.backgroundColor }}>
                <div className={styles.wrapper} style={style}>
                    <div className={styles.value}>{value}</div>
                    <div className={styles.label}>{label}</div>

                    {icon && <div className={iconClasses} />}
                </div>
            </Card>
        )
    }

}