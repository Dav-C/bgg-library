import useFetchControl from "../Hooks/useFetchControl";
import classes from "./UserSearchForm.module.css"
import LoadingSpinner from "./LoadingSpinner";
import {useRouter} from "next/router";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {formStatusActions} from "../store/formStatusSlice";
import {userDataActions} from "../store/userDataSlice";
import {appStateActions} from "../store/appStateSlice";
import ButtonSmall from "./ButtonSmall";

import Card from "./Card";

const UserSearchForm = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const formState = useSelector((state) => state.formStatus)
    const userData = useSelector((state) => state.userData)
    const {fetchGameCollection, parseGameCollectionData, bggUserName, setBggUserName} = useFetchControl();
    const [formValid, setFormValid] = useState(false)

    const onChangeHandler = (event) => {
        setBggUserName(event.target.value)
    }
    const validateForm = (enteredUserName) => {
        if ((enteredUserName.length > 0) && (enteredUserName !== '')) {
            setFormValid(true)
        }
        if ((enteredUserName.length === 0) || (enteredUserName === '')) {
            setFormValid(false)
        }
    }

    useEffect(() => {
        if(formState.fetchStatus === 'complete'){
            dispatch(appStateActions.closeSideBar())
            router.push('gallery_view')
            dispatch(formStatusActions.resetState())
            dispatch(userDataActions.confirmDataLoaded())
        }
        validateForm(bggUserName)
    }, [formState, bggUserName, dispatch, router])

    const onSubmitHandler = (event) => {
        event.preventDefault()
        fetchGameCollection().then(parseGameCollectionData)
    }
    const onClickHandler = (event) => {
        router.reload();
    }
    return (
        <form className={classes.form} onSubmit={onSubmitHandler}>
            {(!formState.loading && !formState.fetchError) &&
                <input
                    name='bggusername'
                    className={classes.userNameInput}
                    onChange={onChangeHandler}
                    type="text"
                    placeholder="bgg username"
                    data-cy="userSearchForm-usernameInput"
                />
            }
            {(formState.loading || formState.fetchError) && <p className={classes.userNameInput}>{userData.bggUserName}</p>}
            {(!formState.loading && !formState.fetchError && formValid)&&
                <button className={classes.submitButton}
                        type="submit"
                        data-cy="userSearchForm-submitButton-active">Load Library</button>
            }
            {!formValid&&
                <button className={classes.disabledButton}
                        type="button"
                        disabled
                        data-cy="userSearchForm-submitButton-disabled">Load Library</button>
            }

            {formState.fetchError &&
                <Card>
                    <p className={classes.errorMessage}
                       data-cy="userSearchForm-fetchErrorMessage">{formState.fetchErrorMessage}
                    </p>
                    <ButtonSmall
                        onClick={onClickHandler}
                        style={{
                            position: 'relative',
                            height: '2.5rem',
                            width: '2.5rem',
                            boxShadow: 'none',
                        }}
                        backgroundImageUrl="/icons/close-button-light.svg"
                        backgroundImageHoverUrl="/icons/close-button.svg"
                        alt="error message close button"
                        dataCy='userSearchForm-error-closeButton'
                    />
                </Card>
            }
            {(formState.fetchStatus === 'fetch_processing') && <p>BGG is processing your request...</p>}
            {formState.loading && <LoadingSpinner />}
        </form>
    )
}

export default UserSearchForm;