import styled from 'styled-components';

export const Bg = styled.div`
    width:100vw;
    height:100vh;
    border:1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2222;
`
export const Wrapper = styled.div`
button {
    width:100%;
  align-items: center;
  appearance: none;
  background-color: #FCFCFD;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0   4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395A;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

button:focus {
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

button:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

button:active {
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}
`
export const InputSection = styled.input`
    @import url('https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@800&family=Shippori+Antique+B1&display=swap');
    font-family: 'Shippori Antique B1', sans-serif;
    font-size: 18px;
    margin-bottom: 20px;
    /* background-color: transparent; */
    display: block;
    max-width: 350px;
    width: 100%;
    height: 50px;
    background: rgba(97, 61, 43, 0.25);
    border-radius: 5px;
    padding-left: 5px;
    border: 2px solid  black;
    color: black;
    ::placeholder{
        opacity: 0.8;
        color: black;
    }
`