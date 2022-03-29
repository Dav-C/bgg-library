import classes from "./index.module.css"
import UserSearchForm from "../Components/UserSearchForm";
import Card from "../Components/Card";
import ButtonSmall from "../Components/ButtonSmall";
import {useState} from "react";

const Home = () => {
    const [helpBoxOpen, setHelpBoxOpen] = useState(false)
    const openHelpBox = () => {
        setHelpBoxOpen(true)
    }
    const closeHelpBox = () => {
        setHelpBoxOpen(false)
    }

    return (
        <main className={classes.pageLayout}>
            <img src="/icons/shelf.svg" alt="shelf icon" width="70" height="70"/>
            <h1 className={classes.headline}>Board Game Library</h1>
            {helpBoxOpen &&
                <Card>
                    <div className={classes.helpBoxContent} data-cy="mainPage-helpContentBox">
                        <ButtonSmall
                            onClick={closeHelpBox}
                            style={{
                                position: 'relative',
                                height: '1.5rem',
                                width: '1.5rem',
                                boxShadow: 'none',
                                borderRadius: '0',
                                alignSelf: 'flex-end'
                            }}
                            backgroundImageUrl="/icons/close-icon-color-555555.svg"
                            backgroundImageHoverUrl="/icons/close-icon-color-555555.svg"
                            alt="close help button"
                            dataCy="mainPage-helpContentBox-closeButton"
                        />
                        <h3 className={classes.helpBoxHeader}>What is ths?</h3>
                        <p>
                            Board Game Library is a fun way to view a board game collection!</p>
                        <p>
                            Enter any <a href="http://boardgamegeek.com">Board Game Geek</a> user name and their
                            public library of games will be displayed as a wall of images. If you do not have a
                            Board Game Geek account, feel free to try mine, username: DC680
                        </p>
                        <p>
                            Once a library is loaded, it can be filtered based game status such as <i>wishlist</i> or <i>for trade</i>.
                        </p>
                        <p>
                            Clicking on a game box will display additional details including supported player counts,
                            average rating and playtime.
                        </p>
                        <p>
                            When requesting a collection, Board Game Geek puts the request into a queue for processing.
                            If a large library was requested, it may take awhile to process.
                        </p>
                        <p>
                            The data that makes this app possible is being provided by Board Game Geek.
                        </p>
                    </div>
                </Card>
            }
            <br/>
            <Card>
                <UserSearchForm />
            </Card>
            {!helpBoxOpen &&
                <ButtonSmall
                    onClick={openHelpBox}
                    style={{
                        position: 'fixed',
                        height: '3rem',
                        width: '3rem',
                        top: '90%',
                        right: '10%',
                        boxShadow: 'none'
                    }}
                    backgroundImageUrl="/icons/question-icon-555555.svg"
                    backgroundImageHoverUrl="/icons/question-icon-00449F.svg"
                    alt="help button"
                    dataCy="mainPage-helpContentBox-openButton"
                />
            }
        </main>
    )
}

export default Home;