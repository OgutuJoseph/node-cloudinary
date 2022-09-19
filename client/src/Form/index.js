import { useState } from 'react';
import './styles.css';
import axios from 'axios'; 
import FileUploader  from '../File/FileUploader';

export const Form = ({ onSuccess }) => {

    const [name, setName] = useState(''); 
    const [selectedFile, setSelectedFile] = useState('');
	const [isSelected, setIsSelected] = useState(false);
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();;
        data.append('name', name);
        data.append('avatar', selectedFile);

        axios.post('http://localhost:5000/users/create', data)
                .then((res) => {
                    alert('User created sucessfully')
                })
                .catch((err) => {  
                    console.log(err)
                })
    }

    const handleSubmission = () => {
		const formData = new FormData();

        formData.append('name', name)
		formData.append('avatar', selectedFile);

		fetch(
			'http://localhost:5000/users/create',
			{
				method: 'POST',
				body: formData, 
			}
		)
			.then((res) => res.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}; 

    return (
        <>
            <h2>Upload Form</h2>
            <form method="post" className='fileForm'> 
                <div className='textInput'>
                    <label>Enter Name : </label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='textInput'>
                    <label>Upload File : </label>
                    <input type="file" name="file" onChange={changeHandler} />
                    {isSelected ? (
                        <div>
                            <p>Filename: {selectedFile.name}</p>
                            <p>Filetype: {selectedFile.type}</p>
                            <p>Size in bytes: {selectedFile.size}</p>
                            <p>
                                lastModifiedDate:{' '}
                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p>Select a file to show details</p>
                    )
                }
                </div> 

                <button onClick={handleSubmission}>Submit</button>
            </form>
        </>
    )
}