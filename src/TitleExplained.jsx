import React from 'react'

class TitleExplained extends React.Component {

    state = {
        isOpen: this.props.isOpen,
    };

    toogle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (<div> 
            <h1 className="underline ml-2 my-4 text-6xl text-center">
                MOB 3D
                <svg  onClick={this.toogle} className="w-5 inline-block cursor-pointer ml-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    {this.state.isOpen && <circle fill="#feebc8" cx="8" cy="8" r="7"/>}
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                    <circle  cx="8" cy="4.5" r="1"/>
                </svg>
            </h1>
        
            {this.state.isOpen && <div className="m-2 p-4 text-justify bg-orange-200 text-sm rounded-lg">
                <p>Cet outil permet de générer des murs de maison à <a href="https://fr.wikipedia.org/wiki/Ossature_plate-forme" target="_blank" rel="noopener noreferrer">ossature plate-forme</a> et de récupérer la liste de toutes les longueurs de sections bois nécessaires 👷</p>
            </div>} 
        </div>)
    }
}

export default TitleExplained;

