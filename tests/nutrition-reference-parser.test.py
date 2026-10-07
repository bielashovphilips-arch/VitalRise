"""Ensure reported traces / censoring do not become dietary numerical zeros."""
import runpy, unittest
parse=runpy.run_path('tools/build-nutrition-reference-supplements.py')['number']

class ReportedComposition(unittest.TestCase):
    def test_unknowns_and_detection_limits(self):
        for value in [None,'','-','N','Tr','(Tr)','<LOD','<LOQ','<0.01']:
            self.assertIsNone(parse(value),value)

    def test_measured_and_published_calculated_numbers(self):
        self.assertEqual(parse('0'),0)
        self.assertEqual(parse('(0)'),0)
        self.assertEqual(parse('(1.5)'),1.5)
        self.assertEqual(parse('318',.001),.318)
        self.assertEqual(parse('7.0000000000000007E-2'),.07)

if __name__=='__main__':unittest.main()
