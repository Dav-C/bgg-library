import classes from "./SlidingSwitch.module.scss"
import {useSelector} from "react-redux";

const SlidingSwitch = (props) => {
    const checked = props.checked

    return (
        <div className={classes.switchWrapper} data-cy={props.dataCy}>
            <label className={classes.switchControl}>
                <p>{props.text}</p>
                <input type="checkbox"
                       checked={checked}
                       onChange={props.onChange}
                />
                    <span className={classes.control} />
            </label>
        </div>
    )
}

export default SlidingSwitch