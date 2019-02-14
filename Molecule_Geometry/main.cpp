#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

/* Plan
Enter formula
Parse thrpugh the letters assign them to char
Assign char to int
compare int value to determine if lower case or upper
if upper then this is new atom
Assign the letters to a new string
If is it a lower case letter htne this is part of the same element
*/
/* Plan2
Assign electronegitivty to each value
Sort the number from least to greatest
Issolate the smallest number for it is the central atom
Compare number of lone pairs of electrons with oter elements
*/

enum atom_code
{
    F, Cl, Br, I, At, Ts,
    O, S, Se, Te, Po,
    N, P, As, Sb, Bi,
    C, Si, Ge, Sn, Pb,
    B, Al,
    H,
};

int valence_shell_elctrons (auto atomic_element);
atom_code hashit (string const& inString);
float electroNegativity (auto atomic_element);
string molecular_shape (int counter, int sum);

int main()
{
    cout << "Enter formula!" << endl;

    string formula;
    string element;
    string elemnt2;
    vector <string> Elements;
    string shape;
    char value, valueNext, temp;
    int cap_or_not = 0;
    int first_letter = 0;
    int num_of_atoms = 0;
    int counter = 1;
    int valence_electrons = 1;
    int sum = 0;
    float electroNegativeNum = 0;

    getline(cin, formula);

    for (int i = 0; i <= formula.length(); i++)
    {
        value = formula[i];
        valueNext = formula[i + 1];
        cap_or_not = valueNext;
        first_letter = value;

        //If the first letter at i is capital proceed if not move on to the next letter (to avoid lowercase letters being stored as elements)
        if (first_letter >= 65 && first_letter < 90)
        {
            //counter ++;
            if (cap_or_not >= 65 && cap_or_not <= 90 || isdigit(valueNext)) //If next letter is a capital than the first letter is an elemnt
            {
                element = value;
                if(isdigit(valueNext)) //If followed by an integer store the element appropriate number of times
                {
                    num_of_atoms = valueNext - '0';
                    for (int j = 1; j <= num_of_atoms; j++)
                    {
                        Elements.push_back(element);
                    }
                }
                else
                {
                    Elements.push_back(element);
                }

            }
            else if (cap_or_not >= 97 && cap_or_not <= 122)    //Check to see if following letter is lower case
            {
                //If so then store the first and second letter as one element

                element = value;
                element += valueNext;

                //If there is a digit after the elemnet then store the variable appropriate number of times
                if(isdigit(formula[i + 2]))
                {
                    num_of_atoms = (formula[i + 2]) - '0';
                    for (int j = 1; j <= num_of_atoms; j++)
                    {
                        elemnt2 = element;
                        Elements.push_back(elemnt2);
                    }
                }
                else
                {
                    Elements.push_back(element);
                }
            }
        }
        else if (first_letter >= 97 && first_letter <=122)
        {
            value = valueNext;
        }

        if(i == formula.length() - 1 && isalpha(value)) //Prevents the last element to be added if not a capital letter
        {
            element = value;
            Elements.push_back(element);
        }
    }
    //Present atoms in formula
    for (auto i = Elements.begin(); i != Elements.end(); ++i)
    {
        //cout << *i << ' ';
        valence_electrons = valence_shell_elctrons(*i);
        electroNegativeNum = electroNegativity(*i);
        sum += valence_electrons;
        //cout << valence_electrons << ' ' << electroNegativeNum << endl;
        //cout << sum << endl;

        if (find(Elements.begin(), Elements.end(), "B") != Elements.end())
        {
            if (counter == 4)
            {
                if (sum == 6)
                {
                    shape = "Trigonal Planar";
                }
            }
        }
        shape = molecular_shape(counter, sum);

        counter ++;
    }
    if (shape == "")
    {
        cout << "Not a real element/ molecule" <<endl;
    }

    cout << shape << endl;

    return 0;
}

//Determine number of valence electrons
int valence_shell_elctrons (auto atomic_element)
{
    int valence_electrons = 0;

    if (atomic_element == "F" || atomic_element == "Cl" || atomic_element == "Br" || atomic_element == "I" || atomic_element == "At" || atomic_element == "Ts")
    {
        return valence_electrons = 1;
    }
    else if (atomic_element == "O" || atomic_element == "S" || atomic_element == "Se" || atomic_element == "Te" || atomic_element == "Po")
    {
        return valence_electrons = 2;
    }
    else if (atomic_element == "N" || atomic_element == "P" || atomic_element == "As" || atomic_element == "Sb" || atomic_element == "Bi")
    {
        return valence_electrons = 3;
    }
    else if (atomic_element == "C" || atomic_element == "Si" || atomic_element == "Ge" || atomic_element == "Sn" || atomic_element == "Pb")
    {
        return valence_electrons = 4;
    }
    else if (atomic_element == "B" || atomic_element == "Al")
    {
        return valence_electrons = 5;
    }
    else if (atomic_element == "H")
    {
        return valence_electrons = 1;
    }
    else
    {
        return valence_electrons = 0;
    }

    return valence_electrons;
}

atom_code hashit (string const& inString)
{
    if (inString == "F") return F;
    if (inString == "Cl") return Cl;
    if (inString == "I") return Br;
    if (inString == "At") return At;
    if (inString == "Ts") return Ts;
    if (inString == "O") return O;
    if (inString == "S") return S;
    if (inString == "Se") return Se;
    if (inString == "Te") return Te;
    if (inString == "Po") return Po;
    if (inString == "N") return N;
    if (inString == "P") return P;
    if (inString == "As") return As;
    if (inString == "Sb") return Sb;
    if (inString == "Bi") return Bi;
    if (inString == "C") return C;
    if (inString == "Si") return Si;
    if (inString == "Ge") return Ge;
    if (inString == "Sn") return Sn;
    if (inString == "Pb") return Pb;
    if (inString == "B") return B;
    if (inString == "Al") return Al;

    if (inString == "H") return H;
}
//Determine elctronegativity of each atom
float electroNegativity (auto atomic_element)
{

    float num = 0;

    switch (hashit(atomic_element))
    {
    case F:
        num = 3.98;
        break;
    case Cl:
        num = 3.16;
        break;
    case Br:
        num = 2.96;
        break;
    case I:
        num = 2.66;
        break;
    case At:
        num = 2.20;
        break;
    case O:
        num = 3.44;
        break;
    case S:
        num = 2.58;
        break;
    case Se:
        num = 2.55;
        break;
    case Te:
        num = 2.10;
        break;
    case Po:
        num = 2.00;
        break;
    case N:
        num = 3.04;
        break;
    case P:
        num = 2.19;
        break;
    case As:
        num = 2.18;
        break;
    case Sb:
        num = 2.05;
        break;
    case Bi:
        num = 2.02;
        break;
    case C:
        num = 2.55;
        break;
    case Si:
        num = 1.90;
        break;
    case Ge:
        num = 2.01;
        break;
    case Sn:
        num = 1.96;
        break;
    case Pb:
        num = 2.33;
        break;
    case B:
        num = 2.04;
        break;
    case Al:
        num = 1.61;
        break;
    case H:
        num = 2.20;
        break;
    }

    return num;
}
//Determine the molecular shape
string molecular_shape (int counter, int sum)
{
    string shape;
    if (counter == 2)
    {
        return shape = "Linear (2 Atoms)";
    }
    else if (counter == 3)
    {
        if (sum == 8)
        {
            return shape = "Linear";
        }
        else if (sum == 6 || sum == 7)
        {
            return shape = "Bent (Trigonal)";
        }
        else if (sum == 4)
        {
            return shape = "Bent (Terahydral)";
        }
    }
    else if (counter == 4)
    {
        if (sum == 8)
        {
            return shape = "Trigonal Planar";
        }
        else if (sum == 6)
        {
            return shape = "Trigonal Pyramidal";
        }
        else if (sum == 4)
        {
            return shape = "T-Shaped";
        }
    }
    else if (counter == 5)
    {
        if (sum == 8)
        {
            return shape = "Tetrahydral";
        }
        else if (sum == 6)
        {
            return shape = "Seesaw";
        }
        else if (sum == 4)
        {
            return shape = "Square Planar";
        }
    }
    return shape;
}
