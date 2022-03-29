import {userDataActions} from "../store/userDataSlice";
import {formStatusActions} from "../store/formStatusSlice";
import {useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {appStateActions} from "../store/appStateSlice";

const useFetchControl = () => {
    const dispatch = useDispatch()
    const [bggUserName, setBggUserName] = useState('')
    const [fetchAttempts, setFetchAttempts] = useState(0)

    // retry a fetch each time the number of fetchAttempts is updated. The exception
    // for fetchAttempts !== 0 is to prevent the fetch from re-trying when the fetch is
    // successful and the gallery_view is loaded (which sets the fetchAttempts back to 0
    const fetchRetry = () => {
        if (fetchAttempts <= 5 && fetchAttempts !== 0) {
            console.log(fetchAttempts)
            setTimeout(() => {
            fetchGameCollection().then(parseGameCollectionData)
            }, 6000)
        }
        if (fetchAttempts >= 4) {
            dispatch(formStatusActions.fetchError('BGG is processing, wait a bit and try again'))
        }
    }
    useEffect(() => {
        fetchRetry()
    }, [fetchAttempts])

    async function fetchGameCollection() {
        dispatch(userDataActions.resetGameCollection())
        dispatch(userDataActions.setBggUserName(bggUserName))
        try {
            let response = await fetch(`https://bgg.cc/xmlapi2/collection?username=${bggUserName}`)
                if (response.status === 200) {
                        return response.text()
                }
                if (response.status === 202) {
                    dispatch(formStatusActions.fetchProcessing());
                    setFetchAttempts(fetchAttempts + 1)
                }
                if (!response.ok ) {
                    dispatch(formStatusActions.fetchError(`error, response from server: ${response.status}`))
                    console.log(`THERE WAS AN ERROR: ${response.status}`)
                }

        } catch (error) {
            // the most likely cause an error is an invalid user name, which is assumed here.
            // The API blocks invalid user names requests via CORS, so it is not possible
            // to actually parse the error message out of the response.
            dispatch(formStatusActions.fetchError('user not found'))
            setFetchAttempts(0)
        }
    }
    // parse XML response from the bgg api and save the data to userDataSlice.js
    // Once the data is stored, push to the 'gallery_view' page
    const parseGameCollectionData = (response) => {
        if(response) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response, "text/xml")
            const allGames = xmlDoc.getElementsByTagName('item')
            let parsedUserCollectionData = []
            for(let itemIndex = 0, max = allGames.length; itemIndex < max; itemIndex++) {
                const itemChildren = allGames[itemIndex].children
                let gameData =  {
                    key: itemIndex,
                    objectId: allGames[itemIndex].getAttribute('objectid'),
                    gameName: null,
                    yearPub: null,
                    imgUrl: '',
                    imgThumb: '',
                    numPlays: null,
                    status: {
                        own: false,
                        prevowned: false,
                        fortrade: false,
                        want: false,
                        wanttoplay: false,
                        wanttobuy: false,
                        wishlist: false,
                        preordered: false,
                        lastmodified: ''
                    }
                }
                for(let childIndex = 0, max = itemChildren.length; childIndex < max; childIndex++) {
                    if (itemChildren.item(childIndex).tagName === 'name') {
                        gameData.gameName = itemChildren.item(childIndex).innerHTML
                    }
                    if (itemChildren.item(childIndex).tagName === 'yearpublished') {
                        gameData.yearPub = itemChildren.item(childIndex).innerHTML
                    }
                    if (itemChildren.item(childIndex).tagName === 'image') {
                        gameData.imgUrl = itemChildren.item(childIndex).innerHTML
                    }
                    if (itemChildren.item(childIndex).tagName === 'thumbnail') {
                        gameData.imgThumb = itemChildren.item(childIndex).innerHTML
                    }
                    if (itemChildren.item(childIndex).tagName === 'numplays') {
                        gameData.numPlays = itemChildren.item(childIndex).innerHTML
                    }
                    if (itemChildren.item(childIndex).tagName === 'status') {
                        for(let attributeIndex = 0,
                                max = itemChildren.item(childIndex).getAttributeNames().length;
                                attributeIndex < max; attributeIndex++)
                        {
                            if (itemChildren.item(childIndex).getAttribute('own') === "1") {
                                gameData.status.own = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('prevowned') === "1") {
                                gameData.status.prevowned = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('fortrade') === "1") {
                                gameData.status.fortrade = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('want') === "1") {
                                gameData.status.want = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('wanttoplay') === "1") {
                                gameData.status.wanttoplay = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('wanttobuy') === "1") {
                                gameData.status.wanttobuy = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('wishlist') === "1") {
                                gameData.status.wishlist = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('preordered') === "1") {
                                gameData.status.preordered = true
                            }
                            if (itemChildren.item(childIndex).getAttribute('lastmodified') === "1") {
                                gameData.status.lastmodified = true
                            }
                        }
                    }
                }
                parsedUserCollectionData.push(gameData)
            }
            dispatch(userDataActions.loadGameCollectionData(parsedUserCollectionData));
            return dispatch(formStatusActions.fetchComplete());
        }
    }


    async function fetchIndividualGameData(objectId) {
        try {
            let response = await fetch(`https://bgg.cc/xmlapi2/thing?id=${objectId}&stats=1`)
                if (response.status === 200) {
                    return response.text()
                }
                if (!response.ok ) {
                    dispatch(formStatusActions.fetchError(`error, response from server: ${response.status}`))
                    console.log(`THERE WAS AN ERROR: ${response.status}`)
                }

        } catch (error) {
            dispatch(formStatusActions.fetchError('game not found'))
        }
    }

    const parseIndividualGameData = (response) => {
        if (response) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, "text/xml")
                const fetchedGameData = xmlDoc.getElementsByTagName('item')[0]
                console.log('fetched data: ' + fetchedGameData)

                let gameData = {
                    gameName: fetchedGameData.getElementsByTagName('name')[0].getAttribute('value'),
                    minPlayers: fetchedGameData.getElementsByTagName('minplayers')[0].getAttribute('value'),
                    maxPlayers: fetchedGameData.getElementsByTagName('maxplayers')[0].getAttribute('value'),
                    minPlaytime: fetchedGameData.getElementsByTagName('minplaytime')[0].getAttribute('value'),
                    maxPlaytime: fetchedGameData.getElementsByTagName('maxplaytime')[0].getAttribute('value'),
                    description: fetchedGameData.getElementsByTagName('description')[0].innerHTML,
                    averageRating: fetchedGameData.getElementsByTagName('statistics')[0]
                                                  .getElementsByTagName('ratings')[0]
                                                  .getElementsByTagName('average')[0]
                                                  .getAttribute('value'),
                    yearPub: fetchedGameData.getElementsByTagName('yearpublished')[0].getAttribute('value'),
                    imgThumb: fetchedGameData.getElementsByTagName('thumbnail')[0].innerHTML,
                    imgUrl: fetchedGameData.getElementsByTagName('image')[0].innerHTML,
                }
                dispatch(userDataActions.loadSelectedGameData(gameData))
            } catch (error) {
                console.log(error)
            }

        }
    }

    return {
        fetchGameCollection,
        parseGameCollectionData,
        fetchIndividualGameData,
        parseIndividualGameData,
        bggUserName,
        setBggUserName,
    }
}

export default useFetchControl;
