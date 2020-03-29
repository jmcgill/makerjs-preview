# MakerJS Preview

An Electron wrapper around the MakerJS playground, providing real-time previews of
MakerJS files, while allowing them to be edited in a real IDE and version controlled on
disk.

Snapshotting can be used to export output to PDF (I've found this works best with CNCs)
and will also save a copy of the code for later reference.

PDF output is written to a directory in the same location as the input file. 

To run:

`npm run start /path/to/input.js`
