import React from 'react'

class Collapsible extends React.Component {

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
            <h2
                className={"relative collapsible-title cursor-pointer hover:bg-gray-200 leading-8 pt-1 px-2 rounded" + (this.state.isOpen ? " is-active" : "")}
                onClick={this.toogle}
            >
                {this.props.title}
                <div className="absolute w-4 right-0 mr-2 inset-y-0 full-h flex items-center">
                    {this.state.isOpen ? <img  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIyLjg4cHgiIGhlaWdodD0iODAuNTkzcHgiIHZpZXdCb3g9IjAgMCAxMjIuODggODAuNTkzIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMjIuODggODAuNTkzIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cG9seWdvbiBwb2ludHM9IjEyMi44OCw4MC41OTMgMTIyLjg4LDQ5Ljc3MiA2MS40NCwwIDAsNDkuNzcyIDAsODAuNTkzIDYxLjQ0LDMwLjgyIDEyMi44OCw4MC41OTMiLz48L2c+PC9zdmc+"></img>
                    : <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIyLjg4cHgiIGhlaWdodD0iODAuNTkzcHgiIHZpZXdCb3g9IjAgMCAxMjIuODggODAuNTkzIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMjIuODggODAuNTkzIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cG9seWdvbiBwb2ludHM9IjEyMi44OCwwIDEyMi44OCwzMC44MiA2MS40NCw4MC41OTMgMCwzMC44MiAwLDAgNjEuNDQsNDkuNzcyIDEyMi44OCwwIi8+PC9nPjwvc3ZnPg=="></img>}
                </div>
            </h2>
            <div
                className={"collapsible mx-2 mt-4 mb-8" + (this.state.isOpen ? " is-active" : "")}
            >
                {this.props.children}
            </div>
        </div>)
    }
}

export default Collapsible;

