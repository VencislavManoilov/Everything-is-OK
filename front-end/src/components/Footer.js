import React from "react";

const Footer = () => {
    return (
        <footer id="footer" className="container-fluid" style={{color: ""}}>
            <div className="row text-center">
                {document.body.scrollHeight > window.innerHeight ? <button className="btn btn-secondary" onClick={window.scrollTo(0, 0)}>Back to top</button> : <></>}
                <p className="opacity-25 mt-1">Made by Vencislav Manoilov</p>
            </div>
        </footer>
    );
}

export default Footer;