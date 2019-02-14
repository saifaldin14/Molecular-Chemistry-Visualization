using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;

public class Molecule : MonoBehaviour {

	[DllImport("Molecular_Geometry.dll", CallingConvention = CallingConvention.Cdecl)]
	static extern float Main (string formula);

	Text text;
	public string formula = "H2O";
	public float num = 0.0f;
	public static string the_shape;
	public GameObject the_final_shape;

	private List<GameObject> models;
	private int selectionIndex;

	private GameObject atomic_shape;

	[SerializeField]
	private InputField input;

	public void GetInput (string mol) {
		Debug.Log ("You entered " + mol);
		formula = mol;
		input.text = "";
	}

	private void Awake () {
	}

	// Use this for initialization
	void Start () {
		text = GetComponent<Text> ();
		//var a_shape = Resources.Load ("Atom Shapes/Cube");
		//the_final_shape = a_shape as GameObject;
		models = new List<GameObject> ();
		foreach (Transform t in transform) {
			models.Add (t.gameObject);
			t.gameObject.SetActive (false);
		}
		models [selectionIndex].SetActive (true);

		
	}
	
	// Update is called once per frame
	void Update () {
		//text.text = Main (formula).ToString ();
		the_shape = Shape (Main(formula));
		text.text = the_shape;

		if (the_shape== "Linear (2 atoms)") {
			Select (0);
		} else if (the_shape == "Linear") {
			Select (0);
		} else if (the_shape == "Bent (Trigonal)") {
			Select (1);
		}
		else if (the_shape == "Bent (Tetrahydral)") {
			Select (1);
		}
		else if (the_shape == "Trigonal Planar") {
			Select (2);
		}
		else if (the_shape == "Trigonal Pyramidal"){
			Select (6);
		}
		else if (the_shape == "T-Shaped") {
			Select (5);
		}
		else if (the_shape == "Tetrahydral") {
			Select (3);
		}
		else if (the_shape == "Seesaw") {
			Select (4);
		}
	}

	private void Spawn () {
		Instantiate (atomic_shape, transform.position, transform.rotation);
	}

	public string Shape (float num) {
		string shape;
		if (num == 1.1f) {
			shape = "Linear (2 atoms)";
		} else if (num == 2.1f) {
			shape = "Linear";
			} else if (num == 2.2f) {
			shape = "Bent (Trigonal)";
			} else if (num == 2.3f) {
			shape = "Bent (Tetrahydral)";
			} else if (num == 3.1f) {
			shape = "Trigonal Planar";
			} else if (num == 3.2f) {
			shape = "Trigonal Pyramidal";
			} else if (num == 3.3f) {
			shape = "T-Shaped";
			} else if (num == 4.1f) {
			shape = "Tetrahydral";
			} else if (num == 4.2f) {
			shape = "Seesaw";
			} else if (num == 4.3f) {
			shape = "Square Planar";
		} else {
			shape = "NULL";
			}
		return shape;
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
