import React, { useEffect, useState } from 'react';
import { Link , useHistory} from 'react-router-dom';
import { FiPower, FiTrash2} from 'react-icons/fi';
import './styles.css';

import logoImage  from '../../assets/logo.svg'; 

import api from '../../services/api';


export default function Profile(){

    const [incidents, setIncidents] = useState([]);
    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    async function BuscarCasos(){

        api.get('profile', {
            headers: {
                Authorization : ongId
            }
        }).then( response => {
                setIncidents(response.data);
                
            });

    }

    useEffect(() => {
        BuscarCasos();
    }, [ongId]);   
    
    async function handleDelete(id){
        try {

            await api.delete(`/incident/${id}`, { headers: {
                Authorization : ongId
            } });
            BuscarCasos();



        } catch (error) {
            alert('Erro ao deletar registro, tente novamente');
        }
    }
    
    function handleLogout() {
        localStorage.clear();
        history.push('/');
    };

    return (
        <div className="profile-container">
            <header>
                <img src={logoImage} alt="Be The Hero"/>
                <span>Bem Vinda, {ongName}</span>
                <Link className="button" to="/incidents/new" >Cadastrar Novo caso </Link>
                <button type="button" onClick={() => handleLogout()} >
                    <FiPower size={18} color="#E02041" ></FiPower>
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident =>  (

                    <li key={incident.id}>
                    <strong>CASO: </strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO: </strong>
                    <p>{incident.description}</p>

                    <strong>VALOR: </strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                    <button type="button" onClick= {  () => handleDelete(incident.id) }>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>

                ))}
            </ul>
            
           
        </div>
    );
}