import classes from "./SideBar.module.css"
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import SlidingSwitch from "./SlidingSwitch";
import {userDataActions} from "../store/userDataSlice";
import {useState} from "react";


const SideBar = (props) => {
    const dispatch = useDispatch()
    const sideBarOpen = useSelector((state) => state.appState.sideBarOpen)
    const [gameFiltersSectionOpen, setGameFiltersSectionOpen] = useState(false)
    const [filtersSectionStyles, setFiltersSectionStyles] = useState({maxHeight: '0'})
    const userData = useSelector((state) => state.userData)

    const toggleDisplayGameTitles = () => {
        if (userData.settings.displayGameTitles === true) {
            dispatch(userDataActions.displayGameTitlesOff())
        }
        if (userData.settings.displayGameTitles === false) {
            dispatch(userDataActions.displayGameTitlesOn())
        }
    }
    const toggleCollectionFilter = (event, filterOption) => {
            dispatch(userDataActions.toggleCollectionFilter(filterOption))
    }
    const toggleGameFiltersSection = () => {
        if (!gameFiltersSectionOpen) {
            setFiltersSectionStyles({maxHeight: '50rem'})
            setGameFiltersSectionOpen(true)
        }
        if (gameFiltersSectionOpen) {
            setFiltersSectionStyles({maxHeight: '0'})
            setTimeout(() => {setGameFiltersSectionOpen(false)}, 500)
        }
    }
    return (
        <div className={`${classes.wrapper} ${sideBarOpen && classes.open}`} data-cy="sideBar-wrapper">

            <div className={classes.optionSwitchesSection}>
                <div className={classes.infoBox}>
                    <p>User Name: <b>{props.bggUserName}</b></p>
                    <p>Game Count:  {props.gameCount}</p>
                </div>
                <SlidingSwitch
                    checked={userData.settings.displayGameTitles}
                    onChange={toggleDisplayGameTitles}
                    text='Display Game Titles'
                    dataCy='optionsSwitch-displayGameTitles'
                />
                {!gameFiltersSectionOpen &&
                    <div onClick={toggleGameFiltersSection}
                         className={`${classes.filtersButton} ${classes.filtersOpenButton}`}
                         data-cy="sideBar-openFilterSection"
                    />
                }
                <div className={classes.filtersSection} style={filtersSectionStyles}>
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.own}
                        onChange={(event) => {toggleCollectionFilter(event, 'own')}}
                        text='Owned'
                        dataCy='filterSwitch-owned'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.prevowned}
                        onChange={(event) => {toggleCollectionFilter(event, 'prevowned')}}
                        text='Previously Owned'
                        dataCy='filterSwitch-prevowned'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.fortrade}
                        onChange={(event) => {toggleCollectionFilter(event, 'fortrade')}}
                        text='For Trade'
                        dataCy='filterSwitch-fortrade'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.want}
                        onChange={(event) => {toggleCollectionFilter(event, 'want')}}
                        text='Want'
                        dataCy='filterSwitch-want'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.wanttobuy}
                        onChange={(event) => {toggleCollectionFilter(event, 'wanttobuy')}}
                        text='Want to Buy'
                        dataCy='filterSwitch-wanttobuy'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.wanttoplay}
                        onChange={(event) => {toggleCollectionFilter(event, 'wanttoplay')}}
                        text='Want to Play'
                        dataCy='filterSwitch-wanttoplay'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.wishlist}
                        onChange={(event) => {toggleCollectionFilter(event, 'wishlist')}}
                        text='Wishlist'
                        dataCy='filterSwitch-wishlist'
                    />
                    <SlidingSwitch
                        checked={userData.settings.collectionFilters.preordered}
                        onChange={(event) => {toggleCollectionFilter(event, 'preordered')}}
                        text='Pre-ordered'
                        dataCy='filterSwitch-preordered'
                    />
                </div>
                {gameFiltersSectionOpen &&
                <div onClick={toggleGameFiltersSection}
                     className={`${classes.filtersButton} ${classes.filtersCloseButton}`}
                     data-cy="sideBar-closeFilterSection"
                />}
            </div>
        </div>
    )
}

export default SideBar