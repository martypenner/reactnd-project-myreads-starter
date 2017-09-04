import glamorous from 'glamorous';
import { css } from 'glamor';

let spin = css.keyframes({
  to: { transform: 'rotate(360deg)' }
});

const Spinner = glamorous.div({
  ':before': {
    content: `''`,
    boxSizing: 'border-box',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '30px',
    height: '30px',
    marginTop: '-15px',
    marginLeft: '-15px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    borderTopColor: '#07d',
    animation: `${spin} .6s linear infinite`
  }
});

export default Spinner;
