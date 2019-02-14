using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChracterManager : MonoBehaviour {

	private List<GameObject> models;
	private int selectionIndex;
	//Molecule _shape = new Molecule();
	//public string shape = _shape.the_final_shape;


	// Use this for initialization
	private void Start () {
		models = new List<GameObject> ();
		foreach (Transform t in transform) {
			models.Add (t.gameObject);
			t.gameObject.SetActive (false);
		}
		models [selectionIndex].SetActive (true);
		
	}
	
	// Update is called once per frame
	private void Update () {
		/*
		if (shape== "Linear (2 atoms)") {
			Select (0);
			Debug.Log ("0");
		} else if (shape == "Linear") {
			Select (0);
			Debug.Log ("0");
		} else if (shape == "Bent (Trigonal)") {
			Select (1);
			Debug.Log ("1");
		}
		else if (shape == "Bent (Tetrahydral)") {
			Select (1);
			Debug.Log ("1");
		}
		else if (shape == "Trigonal Planar") {
			Select (2);
			Debug.Log ("2");
		}
		else if (shape == "Trigonal Pyramidal"){
			Select (6);
			Debug.Log ("6");
		}
		else if (shape == "T-Shaped") {
			Select (5);
			Debug.Log ("5");
		}
		else if (shape == "Tetrahydral") {
			Select (3);
			Debug.Log ("3");
		}
		else if (shape == "Seesaw") {
			Select (4);
			Debug.Log ("4");
		}*/
	}

	public void Select (int index) {
		if (index == selectionIndex)
			return;
		if (index < 0 || index >= models.Count)
			return;

		models [selectionIndex].SetActive (false);
		selectionIndex = index;
		models [selectionIndex].SetActive (true);

	}
}
