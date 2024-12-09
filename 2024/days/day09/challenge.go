package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"slices"
	"strconv"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 2, "part 1 or 2")
	flag.Parse()

	var result int
	if part == 1 {
		result = part1(input)
	} else if part == 2 {
		result = part2(input)
	} else {
		panic("Invalid part")
	}

	fmt.Println(result)
}

func part1(input *string) int {

	fileBlocks, _, freeBlocks, readerIndex := parseInput(input)

mainLoop:
	for len(freeBlocks) > 0 {
		var fileBlock *FileBlock
		fileBlock, readerIndex = getBlockAtIndex(fileBlocks, readerIndex)

		for len(freeBlocks) > 0 && fileBlock != nil {
			freeBlock := &freeBlocks[0]

			if freeBlock.start > readerIndex {
				break mainLoop
			}

			if fileBlock.length < freeBlock.length {
				moveBlock := FileBlock{
					id: fileBlock.id,
					Block: Block{
						start:  freeBlock.start,
						length: fileBlock.length,
					},
				}

				freeBlock.length -= fileBlock.length
				freeBlock.start += fileBlock.length

				delete(fileBlocks, readerIndex)
				fileBlocks[moveBlock.start] = moveBlock
				fileBlock = nil
			} else {
				fileBlocks[freeBlock.start] = FileBlock{
					id: fileBlock.id,
					Block: Block{
						start:  freeBlock.start,
						length: freeBlock.length,
					},
				}

				fileBlock = &FileBlock{
					id: fileBlock.id,
					Block: Block{
						start:  fileBlock.start,
						length: fileBlock.length - freeBlock.length,
					},
				}

				fileBlocks[fileBlock.start] = *fileBlock
				freeBlocks = slices.Delete(freeBlocks, 0, 1)

				if fileBlock.length == 0 {
					delete(fileBlocks, readerIndex)
					break
				}
			}
		}
		readerIndex--
	}

	checksum := 0
	for _, block := range fileBlocks {
		for i := 0; i < block.length; i++ {
			checksum += (block.start + i) * block.id
		}
	}

	return checksum
}

func part2(input *string) int {

	_, fileBlocks, freeBlocks, _ := parseInput(input)

	for i := len(fileBlocks) - 1; i >= 0; i-- {
		for j := 0; j < len(freeBlocks) && freeBlocks[j].start < fileBlocks[i].start; j++ {

			if freeBlocks[j].length >= fileBlocks[i].length {
				fileBlocks[i].start = freeBlocks[j].start
				freeBlocks[j].start += fileBlocks[i].length
				freeBlocks[j].length -= fileBlocks[i].length
				break
			}
		}
	}

	checksum := 0
	for _, block := range fileBlocks {
		for i := 0; i < block.length; i++ {
			checksum += (block.start + i) * block.id
		}
	}

	return checksum
}

type Block struct {
	start  int
	length int
}

type FileBlock struct {
	id int
	Block
}

func parseInput(input *string) (map[int]FileBlock, []FileBlock, []Block, int) {
	fileBlocksMap := make(map[int]FileBlock)
	fileBlocks := make([]FileBlock, 0)
	freeBlocks := make([]Block, 0)
	id := 0
	index := 0
	isEmpty := false

	for i := 0; i < len(*input); i++ {
		num, err := strconv.Atoi(string((*input)[i]))

		if err != nil {
			panic(err)
		}

		if isEmpty {
			if num != 0 {
				freeBlocks = append(freeBlocks, Block{
					start:  index,
					length: num,
				})
			}
		} else {
			fileBlock := FileBlock{
				id: id,
				Block: Block{
					start:  index,
					length: num,
				},
			}
			fileBlocksMap[index] = fileBlock
			fileBlocks = append(fileBlocks, fileBlock)
			id++
		}

		if i < len(*input)-1 {
			index += num
			isEmpty = !isEmpty
		}
	}
	return fileBlocksMap, fileBlocks, freeBlocks, index
}

func getBlockAtIndex(blocks map[int]FileBlock, index int) (*FileBlock, int) {
	startIndex := index

	for blocks[startIndex].length == 0 {
		if startIndex < 0 {
			return nil, -1
		}
		startIndex--
	}

	block := blocks[startIndex]

	return &block, startIndex
}
