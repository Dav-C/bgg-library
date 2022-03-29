import classes from "./InfoBox.module.css"
import ButtonSmall from "./ButtonSmall";
import Image from "next/image";
import {useEffect, useState} from "react";

const InfoBox = (props) => {
    const [averageGameRating, setAverageGameRating] = useState(null)
    const [ratingBoxStyles, setRatingBoxStyles] = useState({})

    useEffect(() => {
        const calculateAverageRating = () => {
            if (props.selectedGameData) {
                const calculatedRating = Math.round(parseFloat(props.selectedGameData.averageRating) * 10) / 10
                setAverageGameRating(calculatedRating)
                adjustRatingBoxStyles(calculatedRating)
            }
        }
        const adjustRatingBoxStyles = (gameRating) => {
            if (gameRating >= 8) {
                setRatingBoxStyles({backgroundColor: 'green'})
            }
            if (gameRating >= 6 && gameRating <= 7.9) {
                setRatingBoxStyles({backgroundColor: 'blue'})
            }
            if (gameRating >= 4 && gameRating <= 5.9) {
                setRatingBoxStyles({backgroundColor: 'darkorange'})
            }
            if (gameRating >= 2 && gameRating <= 4.9) {
                setRatingBoxStyles({backgroundColor: 'red'})
            }
            if (gameRating >= 0 && gameRating <= 1.9) {
                setRatingBoxStyles({backgroundColor: 'darkgrey'})
            }
        }
        calculateAverageRating()
    }, [props.selectedGameData])

    return (
        <div className={classes.modalShade} data-cy='infoBox-modal'>
            <div className={classes.infoBoxWrapper} data-cy="infoBox-wrapper">
                <ButtonSmall
                    backgroundImageUrl="/icons/close-icon-color-555555.svg"
                    backgroundImageHoverUrl="/icons/close-icon-color-555555.svg"
                    onClick={props.onClick}
                    style={{
                        position: 'relative',
                        height: '2rem',
                        width: '2rem',
                        marginLeft: 'auto',
                        boxShadow: 'none',
                        outline: 'none',
                    }}
                    dataCy="infoBox-closeButton"
                />
                <h1 className={classes.gameTitle}>{props.selectedGameData.gameName}</h1>
                <section className={classes.detailSection}>
                    <div className={classes.imageContainer}>
                        <Image src={props.selectedGameData.imgUrl}
                           layout="intrinsic"
                           objectFit="contain"
                           height={300} width={300}
                           alt="box art image"
                        />
                    </div>
                    <div className={classes.infoRight}>
                        <p>Average Rating</p>
                        <div className={classes.ratingBox} style={ratingBoxStyles} data-cy='infoBox-rating'>
                            {averageGameRating}
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Players:</td>
                                    <td className={classes.tableData}>{props.selectedGameData.minPlayers} - {props.selectedGameData.maxPlayers}</td>
                                </tr>
                                <tr>
                                    <td>Playtime (min):</td>
                                    <td className={classes.tableData}>{props.selectedGameData.minPlaytime} - {props.selectedGameData.maxPlaytime}</td>
                                </tr>
                                <tr>
                                    <td>Year Published:</td>
                                    <td className={classes.tableData}>{props.selectedGameData.yearPub}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>

    )
}

export default InfoBox