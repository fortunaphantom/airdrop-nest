import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
// import { CreateAirdropDto } from './dto/create-airdrop.dto';
// import { UpdateAirdropDto } from './dto/update-airdrop.dto';

@Controller('airdrop')
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  // @Post()
  // create(@Body() createAirdropDto: CreateAirdropDto) {
  //   return this.airdropService.create(createAirdropDto);
  // }

  // @Get()
  // findAll() {
  //   return this.airdropService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.airdropService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAirdropDto: UpdateAirdropDto) {
  //   return this.airdropService.update(+id, updateAirdropDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.airdropService.remove(+id);
  // }

  @Post('deploy')
  deploy() {
    this.airdropService.deploy();
  }

  @Post('generate')
  generate() {
    this.airdropService.generateCodes(10000);
  }

  @Post('token')
  getToken() {
    return this.airdropService.fetchCode();
  }
}
