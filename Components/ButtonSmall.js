import classes from "./ButtonSmall.module.css"
import {useState} from "react";


const ButtonSmall = (props) => {
    const [buttonImage, setButtonImage] = useState(props.backgroundImageUrl)
    const [style, setStyle] = useState(props.style)

    const onMouseEnterHandler = () => {
        setButtonImage(props.backgroundImageHoverUrl)
    }
    const onMouseLeaveHandler = () => {
        setButtonImage(props.backgroundImageUrl)
    }
    return (
        <div
            onClick={props.onClick}
            className={classes.buttonSmall}
            style={style}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            data-cy={props.dataCy}
        >
            <img className={classes.buttonImage}
                 src={buttonImage}
                 alt={props.alt}
            />
        </div>

    )
}

export default ButtonSmall