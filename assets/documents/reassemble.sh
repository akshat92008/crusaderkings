#!/bin/bash
cat pdf24_converted.pdf.part* > pdf24_converted.pdf
cat pdf24_converted_1.pdf.part* > 'pdf24_converted (1).pdf'
echo 'PDFs reassembled successfully.'
