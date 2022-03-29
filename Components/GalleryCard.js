import Image from "next/image";
import classes from "./GalleryCard.module.css"
import {Fragment, useState} from "react";
import {useSelector} from "react-redux";


const GalleryCard = (props) => {
    const displayGameTitles = useSelector((state) => state.userData.settings.displayGameTitles)
    const [mouseHover, setMouseHover] = useState(false);
    const mouseEnterHandler = () => {
        setMouseHover(true)
    }
    const mouseLeaveHandler = () => {
        setMouseHover(false)
    }

    return (
        <Fragment>
            {props.imgThumb &&
                <div className={mouseHover ? `${classes.imageBox} ${classes.imageBoxHover}` : classes.imageBox}
                     onMouseOver={mouseEnterHandler}
                     onMouseLeave={mouseLeaveHandler}
                     onClick={props.onClick}
                >
                    {(displayGameTitles && !mouseHover) &&
                        <span className={classes.gameName} data-cy={`galleryCard-gameTitleDiv-${props.objectId}`}>
                            {props.gameName}
                        </span>
                    }
                    <Image
                        src={props.imgThumb}
                        layout="fill"
                        objectFit={mouseHover ? "contain" : "contain"}
                        quality={25}
                        placeholder={"blur"}
                        blurDataURL={props.imgThumb}
                        alt="box art image"
                    />
                </div>
            }
            {!props.imgThumb &&
                <div className={`${classes.imageBox} ${classes.noImage}`}>
                    <p>{props.gameName}</p>
                </div>
            }
        </Fragment>
    )
}

export default GalleryCard