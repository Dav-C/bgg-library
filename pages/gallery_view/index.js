import {Fragment} from "react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSelector, useDispatch} from "react-redux";
import GalleryCard from "../../Components/GalleryCard";
import {userDataActions} from "../../store/userDataSlice";
import {appStateActions} from "../../store/appStateSlice";
import SideBar from "../../Components/SideBar";
import ButtonSmall from "../../Components/ButtonSmall";
import classes from "./index.module.css"
import useFetchControl from "../../Hooks/useFetchControl";
import InfoBox from "../../Components/InfoBox";
import LoadingSpinner from "../../Components/LoadingSpinner";

const GalleryViewPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const formState = useSelector((state) => state.formStatus)
    const userData = useSelector((state) => state.userData)
    const sideBarOpen = useSelector((state) => state.appState.sideBarOpen)
    const infoBoxOpen = useSelector((state) => state.appState.infoBoxOpen)
    const selectedGameData = userData.selectedGameData
    const collectionFilters = userData.settings.collectionFilters
    const [filterInProgress, setFilterInProgress] = useState(true)
    const [filteredGames, setFilteredGames] = useState([])
    let scrollPosition

    const {
        fetchIndividualGameData,
        parseIndividualGameData,
    } = useFetchControl();

    // compare the filters in userDataSlice to the status values for each game. If a filter is true
    // and the same game status is also true, add the game to a filtered game array.  Once all games have
    // been checked, set the filteredGames state.
    const filterGames = () => {
        setFilterInProgress(true)
        const allGamesArray = userData.games
        const filteredGamesArray = []
        const filterKeys = Object.keys(collectionFilters)
        for (let gameIndex = 0, max = allGamesArray.length; gameIndex < max; gameIndex++) {
            let gameStatusKeys = Object.keys(userData.games[gameIndex].status)
            gameStatusKeys.forEach((statusKey, statusIndex) => {
                filterKeys.forEach((filterKey, filterIndex) => {
                    if ((statusKey === filterKey) &&
                        (allGamesArray[gameIndex].status[statusKey] && collectionFilters[filterKey])) {
                        if (!filteredGamesArray.includes(allGamesArray[gameIndex])) {
                            filteredGamesArray.push(allGamesArray[gameIndex])
                        }
                    }
                });
            })
        }
        setFilteredGames(filteredGamesArray)
        return setFilterInProgress(false)
    }

    useEffect(() => {
        if(!userData.userDataLoaded) {
            dispatch(userDataActions.resetGameCollection())
            router.push('/')
        }
        if (userData.userDataLoaded && userData.games) {
            filterGames()
        }
        if (selectedGameData) {
            dispatch(appStateActions.openInfoBox())
        }

    }, [userData, selectedGameData, collectionFilters])


    const openSidebarHandler = () => {
        dispatch(appStateActions.openSideBar())
    }
    const closeSidebarHandler = () => {
        dispatch(appStateActions.closeSideBar())
    }
    const openInfoBoxHandler = (event, objectId) => {
        fetchIndividualGameData(objectId).then(parseIndividualGameData)
    }
    const closeInfoBoxHandler = () => {
        scrollPosition = window.scrollY
        dispatch(appStateActions.closeInfoBox())
        dispatch(userDataActions.resetSelectedGameData())
    }
    return (
        <Fragment>
            <main className={classes.pageLayout}>
                <SideBar
                    bggUserName={userData.bggUserName}
                    gameCount={filteredGames.length}
                />
                {(!sideBarOpen && userData.games) &&
                    <ButtonSmall
                        onClick={openSidebarHandler}
                        style={{
                            position: 'fixed',
                            height: '4rem',
                            width: '4rem',
                            top: '85%',
                            left: '75%',
                        }}
                        backgroundImageUrl="/icons/menu-button-light.svg"
                        backgroundImageHoverUrl="/icons/menu-button.svg"
                        alt="menu button"
                        dataCy="galleryView-openSideBarButton"
                    />
                }
                {(sideBarOpen && userData.games) &&
                    <ButtonSmall
                        onClick={closeSidebarHandler}
                        style={{
                            position: 'fixed',
                            height: '4rem',
                            width: '4rem',
                            top: '85%',
                            left: '75%',
                        }}
                        backgroundImageUrl="/icons/close-button-light.svg"
                        backgroundImageHoverUrl="/icons/close-button.svg"
                        alt="close sidebar button"
                        dataCy="galleryView-closeSideBarButton"
                    />
                }
                {(selectedGameData && infoBoxOpen) &&
                    <InfoBox
                        selectedGameData={selectedGameData}
                        onClick={closeInfoBoxHandler}
                    />
                }
                <section className={classes.imageContainer} data-cy="galleryView-imageContainer">
                    {(userData.userDataLoaded && !formState.loading && !filterInProgress) &&
                    filteredGames.map((item) => (
                            <GalleryCard
                                key={item.key}
                                imgUrl={item.imgUrl}
                                imgThumb={item.imgThumb}
                                gameName={item.gameName}
                                objectId={item.objectId}
                                onClick={(event) => {openInfoBoxHandler(event, item.objectId)}}
                            />
                    ))}
                    {filterInProgress && <LoadingSpinner />}
                    {(userData.userDataLoaded && filteredGames.length === 0 && !filterInProgress) &&
                    <p className={classes.noContentWarning}>No Games &nbsp;&nbsp;:(</p>
                    }
                </section>
            </main>
        </Fragment>
    )
}

export default GalleryViewPage